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
      return await db(this.tableName)
        .select('*')
        .leftJoin('roles', 'users.role_id', 'roles.id'); // exemplo com join
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
        .where("users.id", id)   // 👈 coluna totalmente qualificada
        .first();

      return user || null;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  }


  async getByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await db(this.tableName)
        .where({ email })
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
      await db("users")
        .where("users.id", id)   // 👈 também qualificado
        .update({
          name: data.name,
          email: data.email,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        });

      // depois de atualizar, pega os dados formatados pelo getById
      return await this.getById(id);
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db(this.tableName).where({ id }).del();
    } catch (error) {
      console.error(`Erro ao deletar usuário com id ${id}:`, error);
      throw error;
    }
  }
}
