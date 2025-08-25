import db from "../../config/ps.config";
import { IUser } from "../user/interfaces/user.interface";
import { SignupAuthDto } from "./dto/signup.dto";

export default class AuthRepository {
  private table = "users";

  // async signup(data: SignupAuthDto):Promise<IUser> {
  //      try {
  //        const [user] = await db(this.table)
  //          .insert(data)
  //          .returning('*'); // retorna os dados inseridos (Postgres)
   
  //        return user;
  //      } catch (error) {
  //        console.error('Erro ao criar usuário no repositório:', error);
  //        throw error;
  //      }
  // }

  async getByEmail(email: string) {
    if (!email) throw new Error("Email é obrigatório para buscar usuário.");

    try {
      return await db(this.table).where({ email }).first();
    } catch (error) {
      console.error("Erro ao buscar usuário por email:", error);
      throw new Error("Erro ao buscar usuário por email.");
    }
  }

async findByEmailWithPassword(email: string) {
  if (!email) throw new Error("Email é obrigatório.");

  try {
    return await db('users')
      .select(
        'users.id',
        'users.name',
        'users.lastName',
        'users.email',
        'users.password_hash',
        'users.twoFactorSecret',
        'users.isTwoFactorEnabled',
        'users.refreshToken',
        'users.bio',
        'users.avatarUrl',
        'users.role_id',
        'roles.name as role_name',
        'roles.description as role_description'
      )
      .leftJoin('roles', 'users.role_id', 'roles.id')
      .where('users.email', email)
      .first();
  } catch (error) {
    console.error('Erro ao buscar usuário com senha:', error);
    throw new Error('Erro ao buscar usuário com senha.');
  }
}


  async findById(id: number) {
    if (!id || typeof id !== "number") throw new Error("ID inválido.");

    try {
      // Supondo que você tenha tabelas 'roles', 'role_permissions', 'permissions'
      // Para trazer dados relacionados, faça joins. Exemplo básico:
      const user = await db(this.table)
        .select(
          `${this.table}.*`,
          "roles.name as role_name",
          "permissions.name as permission_name"
        )
        .leftJoin("roles", `${this.table}.role_id`, "roles.id")
        .leftJoin(
          "role_permissions",
          "roles.id",
          "role_permissions.role_id"
        )
        .leftJoin(
          "permissions",
          "role_permissions.permission_id",
          "permissions.id"
        )
        .where(`${this.table}.id`, id)
        .first();

      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw new Error("Erro ao buscar usuário por ID.");
    }
  }

  async updateTwoFactorSecret(id: number, secret: string) {
    if (!id || !secret) throw new Error("ID e segredo são obrigatórios.");

    try {
      await db(this.table)
        .where({ id })
        .update({
          twoFactorSecret: secret,
          isTwoFactorEnabled: true,
          updated_at: db.fn.now(),
        });
    } catch (error) {
      console.error("Erro ao atualizar 2FA:", error);
      throw new Error("Erro ao atualizar chave 2FA do usuário.");
    }
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    if (!id || !refreshToken) throw new Error("ID e refresh token são obrigatórios.");

    try {
      await db(this.table)
        .where({ id })
        .update({ refreshToken, updated_at: db.fn.now() });
    } catch (error) {
      console.error("Erro ao atualizar refresh token:", error);
      throw new Error("Erro ao atualizar o refresh token do usuário.");
    }
  }

  async clearRefreshToken(userId: number): Promise<void> {
    try {
      await db(this.table)
        .where({ id: userId })
        .update({ refreshToken: "", updated_at: db.fn.now() });
    } catch (error) {
      console.error("Erro ao limpar o refresh token:", error);
      throw new Error("Erro ao realizar logout no banco de dados.");
    }
  }
}
