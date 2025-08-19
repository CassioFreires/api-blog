import { Request, Response } from 'express';
import { CreateRole } from './dto/create-role';
import { createRoleSchema } from './schema/create-role.schema';
import { IRole } from './interfaces/role.interface';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role';


export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    async create(req: Request, res: Response): Promise<Response<IRole>> {
        try {
            const data: CreateRole = req.body;

            const resultRole = await this.roleService.getByName(data.name);
            if (resultRole) {
                return res.status(400).json({ message: 'Name already in use' });
            }

            const validation = createRoleSchema.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                });
            }

            const role = await this.roleService.create(data);
            return res.status(201).json({ message: 'Role created', data: role });
        } catch (error: any) {
            console.error('Error creating Role:', error);
            // Tratamento específico para erro de name duplicado (fallback caso falhe o getByName)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'Name already registered' });
            }

            return res.status(500).json({
                message: 'Internal server error while creating role'
            });
        }
    }


    async getAll(req: Request, res: Response): Promise<Response<IRole>> {
        try {
            const roles = await this.roleService.getAll();
            console.log(roles)
            if (!roles || roles.length === 0) {
                return res.status(404).json({ message: 'No roles found' });
            }
            return res.status(200).json({ message: 'roles fetched', data: roles });
        } catch (error) {
            console.error('Error fetching roles:', error);
            return res.status(500).json({ message: 'Internal server error while fetching roles' });
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IRole>> {
        try {
            const id = Number(req.params.id);
            const role = await this.roleService.getById(id);
            if (!role) {
                return res.status(404).json({ message: 'role not found' });
            }
            return res.status(200).json({ message: 'role fetched', data: role });
        } catch (error) {
            console.error('Error fetching role by ID:', error);
            return res.status(500).json({ message: 'Internal server error while fetching role by ID' });
        }
    }

    async update(req: Request, res: Response): Promise<Response<IRole>> {
        try {
            const id = Number(req.params.id);
            const data: UpdateRoleDto = req.body;
            const role = await this.roleService.update(id, data);
            if (!role) {
                return res.status(404).json({ message: 'role not found or not updated' });
            }
            return res.status(200).json({ message: 'role updated', data: role });
        } catch (error) {
            console.error('Error updating role:', error);
            return res.status(500).json({ message: 'Internal server error while updating role' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response<IRole>> {
        try {
            const id = Number(req.params.id);
            const role = await this.roleService.getById(id);
            if (!role) { return res.status(404).json({ message: 'role not found', data: null }) }
            await this.roleService.delete(id);
            return res.status(200).json({ message: 'role deleted', data: role });
        } catch (error) {
            console.error('Error deleting role:', error);
            return res.status(500).json({ message: 'Internal server error while deleting role' });
        }
    }
}
