import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user";
import db from "../../config/ps.config"; // sua instância do knex
import { IUser } from "./interfaces/user.interface";

export class UserRepository {
  private tableName = 'users'; // Nome da tabela no banco

  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      const [user] = await db(this.tableName)
        .insert(data)
        .returning('*'); // retorna os dados inseridos (Postgres)

      return user;
    } catch (error) {
      console.error('Erro ao criar usuário no repositório:', error);
      throw error;
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      // OTIMIZAÇÃO: Adicionando colunas de role para evitar N+1 queries no front-end
      return await db(this.tableName)
        .select('users.*', 'roles.id as role_id', 'roles.name as role_name', 'roles.description as role_description')
        .leftJoin('roles', 'users.role_id', 'roles.id');
    } catch (error) {
      console.error('Erro ao buscar todos usuários no repositório:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IUser | null> {
    try {
      const user = await db("users")
        .select(
          "users.id",
          "users.name",
          "users.email",
          "users.bio",
          "users.avatarUrl",
          "roles.id as role_id",
          "roles.name as role_name",
          "roles.description as role_description"
        )
        .leftJoin("roles", "users.role_id", "roles.id")
        .where("users.id", id) // 👈 coluna totalmente qualificada
        .first();

      return user || null;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<IUser | null> {
    try {
      // OTIMIZAÇÃO: Qualificando a coluna email e adicionando select para evitar colisão de nomes
      const user = await db(this.tableName)
        .select('users.*', 'roles.name as role_name')
        .where('users.email', email)
        .leftJoin('roles', 'users.role_id', 'roles.id')
        .first();

      return user ?? null;
    } catch (error) {
      console.error(`Erro ao buscar usuário com email ${email}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDTO): Promise<IUser | null> {
    try {
      // OTIMIZAÇÃO: Usando `returning('*')` para obter o usuário atualizado em uma única query
      const [updatedUser] = await db("users")
        .where("users.id", id)
        .update({
          name: data.name,
          email: data.email,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        })
        .returning('*');

      return updatedUser ?? null;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // OTIMIZAÇÃO: Retorna um booleano para indicar se a exclusão ocorreu
      const deletedRows = await db(this.tableName).where({ id }).del();
      return deletedRows > 0;
    } catch (error) {
      console.error(`Erro ao deletar usuário com id ${id}:`, error);
      throw error;
    }
  }

  // Função para buscar os amigos do usuário logado
  async getFriends(userId: number): Promise<number[]> {
    const friendships = await db('friendships')
      .where('user_id', userId)
      .andWhere('status', 'accepted')
      .select('friend_id');

    // Retorna um array de IDs de amigos
    return friendships.map(friend => friend.friend_id);
  }

  // Nova função para buscar sugestões de amizade
  async getFriendshipSuggestions(userId: number): Promise<IUser[]> {
    try {
      // Passo 1: Obter os IDs de todos os usuários relacionados (amigos e pendentes)
      const relatedIds = await this.getRelatedUsers(userId);

      // Inclui o próprio ID do usuário para garantir que ele não seja retornado
      const excludeIds = [...relatedIds, userId];

      // Passo 2: Buscar usuários que NÃO estão na lista de IDs relacionados
      const users = await db(this.tableName)
        .select(
          'users.id',
          'users.name',
          'users.lastName',
          'users.email',
          'users.bio',
          'users.avatarUrl',
          'roles.name as role_name',
          'roles.description as role_description'
        )
        .leftJoin('roles', 'users.role_id', 'roles.id')
        .whereNotIn('users.id', excludeIds) // Filtra IDs que já têm uma relação
        .limit(20);

      return users;
    } catch (error) {
      console.error('Erro ao buscar sugestões de amizade:', error);
      throw error;
    }
  }
  async getFriendshipStatus(userId: number, friendId: number): Promise<any | null> {
    // Check for both friendship directions to avoid duplicates
    const friendship = await db('friendships')
      .where(function () {
        this.where('user_id', userId).andWhere('friend_id', friendId);
      })
      .orWhere(function () {
        this.where('user_id', friendId).andWhere('friend_id', userId);
      })
      .first();

    return friendship || null;
  }

  // And the addFriend function you'll call from the service
  async addFriend(userId: number, friendId: number): Promise<void> {
    try {
      await db('friendships').insert({
        user_id: userId,
        friend_id: friendId,
        status: 'pending' // Initial status is 'pending'
      });
    } catch (error) {
      console.error('Error adding friend to friendships table:', error);
      throw error;
    }
  }

  // Retorna IDs de todos os usuários com quem o usuário logado tem uma relação
  async getRelatedUsers(userId: number): Promise<number[]> {
    const relatedIds = await db('friendships')
      .where('user_id', userId)
      .orWhere('friend_id', userId)
      .select('user_id', 'friend_id');

    // Converte o array de objetos em um array simples de IDs e remove duplicatas
    const allIds = relatedIds.flatMap(row => [row.user_id, row.friend_id]);
    const uniqueIds = [...new Set(allIds)].filter(id => id !== userId);

    return uniqueIds;
  }

  // Função para buscar todos os amigos confirmados do usuário logado
  async getAcceptedFriends(userId: number): Promise<IUser[]> {
    try {
      const friends = await db('friendships')
        // Seleciona a coluna 'friend_id' para encontrar os amigos do usuário logado
        .select('friend_id')
        .where('user_id', userId)
        .andWhere('status', 'accepted');

      // Seleciona a coluna 'user_id' para encontrar os amigos que adicionaram o usuário logado
      const friendsOfFriends = await db('friendships')
        .select('user_id')
        .where('friend_id', userId)
        .andWhere('status', 'accepted');

      // Combina e obtém os IDs únicos de todos os amigos aceitos
      const allFriendIds = [...friends.map(f => f.friend_id), ...friendsOfFriends.map(f => f.user_id)];
      const uniqueFriendIds = [...new Set(allFriendIds)];

      // Busca os detalhes dos usuários a partir da lista de IDs
      const userDetails = await db('users')
        .select(
          'users.id',
          'users.name',
          'users.lastName',
          'users.email',
          'users.bio',
          'users.avatarUrl',
          'roles.name as role_name',
          'roles.description as role_description'
        )
        .leftJoin('roles', 'users.role_id', 'roles.id')
        .whereIn('users.id', uniqueFriendIds);

      return userDetails;

    } catch (error) {
      console.error('Erro ao buscar amigos no repositório:', error);
      throw error;
    }
  }

}