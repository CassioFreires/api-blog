// src/modules/user/services/user.service.ts
import { CreateRolePermissionDto } from './dto/create-role-permission';
import { UpdateRolePermission } from './dto/update-role-permission';
import { IRolePermission } from './interfaces/role-permission.interface';
import { RolePermissionRepository } from './role-permission.repository';

export class RolePermissionService {
    private readonly rolePermissionRepository = new RolePermissionRepository();

    async create(data: CreateRolePermissionDto): Promise<IRolePermission[] | null> {
        try {
            const newData = {
                role_id: data.role_id,
                permission_id: data.permission_id,
            };
            return await this.rolePermissionRepository.create(newData);
        } catch (error) {
            console.error('Erro ao criar role permission:', error);
            throw error;
        }
    }

    async getAll(): Promise<IRolePermission[]> {
        try {
            return await this.rolePermissionRepository.getAll();
        } catch (error) {
            console.error('Erro ao buscar todos roles:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<IRolePermission | null> {
        try {
            return await this.rolePermissionRepository.getById(id); // apenas retorna null se não encontrar
        } catch (error) {
            console.error(`Erro ao buscar role permission com id ${id}:`, error);
            throw error;
        }
    }

    async update(data: UpdateRolePermission): Promise<IRolePermission[]> {
        try {
            const { role_id, permission_id } = data;

            if (!permission_id || permission_id.length === 0) {
                throw new Error('Permissões não fornecidas.');
            }

            return await this.rolePermissionRepository.update(data);
        } catch (error) {
            console.error(`Erro ao atualizar role permission:`, error);
            throw error;
        }
    }


    async delete(id: number): Promise<void> {
        try {
            await this.rolePermissionRepository.delete(id);
        } catch (error) {
            console.error(`Erro ao deletar role permission com id ${id}:`, error);
            throw error;
        }
    }
}
