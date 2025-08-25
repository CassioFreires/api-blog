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
}