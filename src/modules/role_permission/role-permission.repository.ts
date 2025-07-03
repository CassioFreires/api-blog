import { RolePermissionEntity } from "./entities/create-role-permission";
import { CreateRolePermissionDto } from "./dto/create-role-permission";
import { UpdateRolePermission } from "./dto/update-role-permission";
import PsDatabase from "../../config/ps.config";
import { Repository } from "typeorm";
import { IRolePermission } from "./interfaces/role-permission.interface";
import { RoleEntity } from "../role/entities/role.entities";
import { PermissionEntity } from "../permission/entities/permission.entitie";

export class RolePermissionRepository {
    private repo: Repository<RolePermissionEntity>;
    private repoRole: Repository<RoleEntity>;
    private repoPermission: Repository<PermissionEntity>;

    constructor() {
        this.repo = PsDatabase.getRepository(RolePermissionEntity);
        this.repoRole = PsDatabase.getRepository(RoleEntity);
        this.repoPermission = PsDatabase.getRepository(PermissionEntity);
    }

    async create(data: CreateRolePermissionDto): Promise<IRolePermission[] | null> {
        try {
            const { role_id, permission_id } = data;

            // Verifica se a role existe
            const roleExists = await this.repoRole.findOneBy({ id: role_id });
            if (!roleExists) {
                console.error(`Role com id ${role_id} não encontrado.`);
                return null;
            }

            const ids = Array.isArray(permission_id) ? permission_id : [permission_id];

            // Verifica se as permissões existem
            const foundPermissions = await this.repoPermission.findByIds(ids);
            console.log(foundPermissions)
            const foundIds = foundPermissions.map(p => p.id);
            const notFound = ids.filter(id => !foundIds.includes(id));

            if (notFound.length > 0) {
                console.error(`Permissions não encontradas: ${notFound.join(', ')}`);
                return null;
            }

            const entries = ids.map((pid) => {
                const entity = new RolePermissionEntity();
                entity.role_id = role_id;
                entity.permission_id = pid;
                return entity;
            });

            return await this.repo.save(entries);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Erro ao criar role permission no repositório:', error.message);
            } else {
                console.error('Erro desconhecido ao criar role permission:', error);
            }
            return null;
        }
    }




    async getAll(): Promise<IRolePermission[]> {
        try {
            return await this.repo.find();
        } catch (error) {
            console.error('Erro ao buscar todos roles no repositório:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<IRolePermission | null> {
        try {
            return await this.repo.findOneBy({ id });
        } catch (error) {
            console.error(`Erro ao buscar role permission com id ${id} no repositório:`, error);
            throw error;
        }
    }

    async update(data: UpdateRolePermission): Promise<IRolePermission[]> {
        try {
            const { role_id, permission_id } = data;

            if (!permission_id || !Array.isArray(permission_id) || permission_id.length === 0) {
                throw new Error('Permissões não fornecidas para atualização.');
            }

            await this.repo.delete({ role_id });

            const newPermissions = permission_id.map(pid => {
                const entity = new RolePermissionEntity();
                entity.role_id = role_id;
                entity.permission_id = pid;
                return entity;
            });

            return await this.repo.save(newPermissions);
        } catch (error) {
            console.error(`Erro ao atualizar role permission para role_id ${data.role_id}:`, error);
            throw error;
        }
    }


    async delete(id: number): Promise<void> {
        try {
            await this.repo.delete(id);
        } catch (error) {
            console.error(`Erro ao deletar role permission com id ${id} no repositório:`, error);
            throw error;
        }
    }
}
