import { Request, Response } from 'express';
import { CreateRolePermissionDto } from './dto/create-role-permission';
import { createRolePermissionSchema } from './schema/create-role-permission.schema';
import { IRolePermission } from './interfaces/role-permission.interface';
import { UpdateRolePermission } from './dto/update-role-permission';
import { RolePermissionService } from './role-permission.service';

export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) { }

    async create(req: Request, res: Response): Promise<Response<IRolePermission>> {
        try {
            const data: CreateRolePermissionDto = req.body;

            const validation = createRolePermissionSchema.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                });
            }

            const rolePermission = await this.rolePermissionService.create(data);
            return res.status(201).json({ message: 'role permission created', data: rolePermission });
        } catch (error: any) {
            console.error('Error creating role permission:', error);
            // Tratamento específico para erro de name duplicado (fallback caso falhe o getByName)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'Role permission already registered' });
            }

            return res.status(500).json({
                message: 'Internal server error while creating role permission'
            });
        }
    }


    async getAll(req: Request, res: Response): Promise<Response<IRolePermission>> {
        try {
            const rolePermissions = await this.rolePermissionService.getAll();
            if (!rolePermissions || rolePermissions.length === 0) {
                return res.status(404).json({ message: 'No role permissions found' });
            }
            return res.status(200).json({ message: 'role permissions fetched', data: rolePermissions });
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            return res.status(500).json({ message: 'Internal server error while fetching role permissions' });
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IRolePermission>> {
        try {
            const id = Number(req.params.id);
            const rolePermission = await this.rolePermissionService.getById(id);
            if (!rolePermission) {
                return res.status(404).json({ message: 'role permission not found' });
            }
            return res.status(200).json({ message: 'role permission fetched', data: rolePermission });
        } catch (error) {
            console.error('Error fetching role permission by ID:', error);
            return res.status(500).json({ message: 'Internal server error while fetching role permission by ID' });
        }
    }

    async update(req: Request, res: Response): Promise<Response<IRolePermission>> {
        try {
            const data: UpdateRolePermission = req.body;

            if (!data.role_id || !Array.isArray(data.permission_id) || data.permission_id.length === 0) {
                return res.status(400).json({ message: 'Dados inválidos para atualização de permissões' });
            }

            const rolePermission = await this.rolePermissionService.update(data);

            return res.status(200).json({ message: 'Role permissions atualizadas com sucesso', data: rolePermission });
        } catch (error) {
            console.error('Erro ao atualizar role permission:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar role permission' });
        }
    }


    async delete(req: Request, res: Response): Promise<Response<IRolePermission>> {
        try {
            const id = Number(req.params.id);
            const rolePermission = await this.rolePermissionService.getById(id);
            if (!rolePermission) { return res.status(404).json({ message: 'role permission not found', data: null }) }
            await this.rolePermissionService.delete(id);
            return res.status(200).json({ message: 'role permission deleted', data: rolePermission });
        } catch (error) {
            console.error('Error deleting role permission:', error);
            return res.status(500).json({ message: 'Internal server error while deleting role permission' });
        }
    }
}
