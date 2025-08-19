import db from "../../config/ps.config";
import { CreatePermission } from "./dto/create-permission.dto";
import { UpdatePermission } from "./dto/update-permission.dto";
import { IPermission } from "./interfaces/permission.interface";

export class PermissionRepository {
  private table = "permissions";

  async create(data: CreatePermission): Promise<IPermission> {
    try {
      const [permission] = await db(this.table)
        .insert({
          name: data.name,
          description: data.description,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning("*");

      return permission;
    } catch (error) {
      console.error("Erro ao criar permission no repositório:", error);
      throw error;
    }
  }

  async getAll(): Promise<IPermission[]> {
    try {
      return await db(this.table).select("*");
    } catch (error) {
      console.error("Erro ao buscar todas permissões no repositório:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<IPermission | null> {
    try {
      const permission = await db(this.table)
        .where({ id })
        .first();

      return permission ?? null;
    } catch (error) {
      console.error(`Erro ao buscar permission com id ${id}:`, error);
      throw error;
    }
  }

  async getByName(name: string): Promise<IPermission | null> {
    try {
      const permission = await db(this.table)
        .where({ name })
        .first();

      return permission ?? null;
    } catch (error) {
      console.error(`Erro ao buscar permission com name ${name}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdatePermission): Promise<IPermission | null> {
    try {
      await db(this.table)
        .where({ id })
        .update({
          ...data,
          updated_at: new Date()
        });

      const updatedPermission = await this.getById(id);
      return updatedPermission;
    } catch (error) {
      console.error(`Erro ao atualizar permission com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db(this.table).where({ id }).del();
    } catch (error) {
      console.error(`Erro ao deletar permission com id ${id}:`, error);
      throw error;
    }
  }

  async findByIds(ids: number[]): Promise<IPermission[]> {
    try {
      return await db(this.table).whereIn("id", ids);
    } catch (error) {
      console.error("Erro ao buscar permissões pelos IDs:", error);
      throw error;
    }
  }
}
