import { CreateRolePermissionDto } from "./dto/create-role-permission";
import { UpdateRolePermission } from "./dto/update-role-permission";
import db from "../../config/ps.config"; // instância do Knex
import { IRolePermission } from "./interfaces/role-permission.interface";

export class RolePermissionRepository {
  private table = "role_permissions";
  private roleTable = "roles";
  private permissionTable = "permissions";

  async create(data: CreateRolePermissionDto): Promise<IRolePermission[] | null> {
    try {
      const { role_id, permission_id } = data;
      const ids = Array.isArray(permission_id) ? permission_id : [permission_id];

      // Verifica se a role existe
      const roleExists = await db(this.roleTable).where({ id: role_id }).first();
      if (!roleExists) {
        console.error(`Role com id ${role_id} não encontrada.`);
        return null;
      }

      // Verifica se as permissions existem
      const foundPermissions = await db(this.permissionTable)
        .whereIn("id", ids)
        .select("id");

      const foundIds = foundPermissions.map(p => p.id);
      const notFound = ids.filter(id => !foundIds.includes(id));

      if (notFound.length > 0) {
        console.error(`Permissions não encontradas: ${notFound.join(", ")}`);
        return null;
      }

      // Cria as associações role-permission
      const entries = ids.map(pid => ({
        role_id,
        permission_id: pid,
      }));

      const inserted = await db(this.table)
        .insert(entries)
        .returning("*");

      return inserted;
    } catch (error) {
      console.error("Erro ao criar role_permission:", error);
      return null;
    }
  }

  async getAll(): Promise<IRolePermission[]> {
    try {
      return await db(this.table).select("*");
    } catch (error) {
      console.error("Erro ao buscar todas as role_permissions:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<IRolePermission | null> {
    try {
      const result = await db(this.table).where({ id }).first();
      return result ?? null;
    } catch (error) {
      console.error(`Erro ao buscar role_permission com id ${id}:`, error);
      throw error;
    }
  }

  async update(data: UpdateRolePermission): Promise<IRolePermission[]> {
    try {
      const { role_id, permission_id } = data;

      if (!permission_id || !Array.isArray(permission_id) || permission_id.length === 0) {
        throw new Error("Permissões não fornecidas para atualização.");
      }

      // Remove todas as permissões existentes para a role
      await db(this.table).where({ role_id }).delete();

      // Insere as novas permissões
      const newPermissions = permission_id.map(pid => ({
        role_id,
        permission_id: pid,
      }));

      const inserted = await db(this.table)
        .insert(newPermissions)
        .returning("*");

      return inserted;
    } catch (error) {
      console.error(`Erro ao atualizar role_permission para role_id ${data.role_id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db(this.table).where({ id }).delete();
    } catch (error) {
      console.error(`Erro ao deletar role_permission com id ${id}:`, error);
      throw error;
    }
  }
}
