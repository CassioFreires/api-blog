import { CreateRoleDTO } from "./schema/create-role.schema";
import { UpdateRoleDto } from "./dto/update-role";
import db from "../../config/ps.config"; // instância do knex
import { IRole } from "./interfaces/role.interface";

export class RoleRepository {
  private table = "roles"; // Nome da tabela no banco

  async create(data: CreateRoleDTO): Promise<IRole> {
    try {
      const [role] = await db(this.table)
        .insert(data)
        .returning("*"); // PostgreSQL: retorna a linha inserida
      return role;
    } catch (error) {
      console.error("Erro ao criar role:", error);
      throw error;
    }
  }

  async getAll(): Promise<IRole[]> {
    try {
      return await db(this.table).select("*");
    } catch (error) {
      console.error("Erro ao buscar todas as roles:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<IRole | null> {
    try {
      const role = await db(this.table).where({ id }).first();
      return role ?? null;
    } catch (error) {
      console.error(`Erro ao buscar role com id ${id}:`, error);
      throw error;
    }
  }

  async getByName(name: string): Promise<IRole | null> {
    try {
      const role = await db(this.table).where({ name }).first();
      return role ?? null;
    } catch (error) {
      console.error(`Erro ao buscar role com nome ${name}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateRoleDto): Promise<IRole | null> {
    try {
      await db(this.table).where({ id }).update(data);
      return await this.getById(id);
    } catch (error) {
      console.error(`Erro ao atualizar role com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db(this.table).where({ id }).delete();
    } catch (error) {
      console.error(`Erro ao deletar role com id ${id}:`, error);
      throw error;
    }
  }
}
