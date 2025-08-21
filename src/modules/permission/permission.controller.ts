import { Request, Response } from 'express';
import { CreatePermission } from './dto/create-permission.dto';
import { createPermissionSchema } from './schema/create-permission.schema';
import { IPermission } from './interfaces/permission.interface';
import { UpdatePermission } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';


export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    async create(req: Request, res: Response): Promise<Response<IPermission>> {
        try {
            const data: CreatePermission = req.body;

            const resultPermission = await this.permissionService.getByName(data.name);
            if (resultPermission) {
                return res.status(400).json({ message: 'Name already in use' });
            }

            const validation = createPermissionSchema.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                });
            }

            const permission = await this.permissionService.create(data);
            return res.status(201).json({ message: 'permission created', data: permission });
        } catch (error: any) {
            console.error('Error creating permission:', error);
            // Tratamento específico para erro de name duplicado (fallback caso falhe o getByName)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'Name already registered' });
            }

            return res.status(500).json({
                message: 'Internal server error while creating role'
            });
        }
    }


    async getAll(req: Request, res: Response): Promise<Response<IPermission>> {
        try {
            const permission = await this.permissionService.getAll();
            if (!permission || permission.length === 0) {
                return res.status(404).json({ message: 'No permission found' });
            }
            return res.status(200).json({ message: 'permission fetched', data: permission });
        } catch (error) {
            console.error('Error fetching permission:', error);
            return res.status(500).json({ message: 'Internal server error while fetching permission' });
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IPermission>> {
        try {
            const id = Number(req.params.id);
            const permission = await this.permissionService.getById(id);
            if (!permission) {
                return res.status(404).json({ message: 'permission not found' });
            }
            return res.status(200).json({ message: 'permission fetched', data: permission });
        } catch (error) {
            console.error('Error fetching permission by ID:', error);
            return res.status(500).json({ message: 'Internal server error while fetching permission by ID' });
        }
    }

    async update(req: Request, res: Response): Promise<Response<IPermission>> {
        try {
            const id = Number(req.params.id);
            const data: UpdatePermission = req.body;
            const permission = await this.permissionService.update(id, data);
            if (!permission) {
                return res.status(404).json({ message: 'permission not found or not updated' });
            }
            return res.status(200).json({ message: 'permission updated', data: permission });
        } catch (error) {
            console.error('Error updating permission:', error);
            return res.status(500).json({ message: 'Internal server error while updating permission' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response<IPermission>> {
        try {
            const id = Number(req.params.id);
            const permission = await this.permissionService.getById(id);
            if (!permission) { return res.status(404).json({ message: 'permission not found', data: null }) }
            await this.permissionService.delete(id);
            return res.status(200).json({ message: 'permission deleted', data: permission });
        } catch (error) {
            console.error('Error deleting permission:', error);
            return res.status(500).json({ message: 'Internal server error while deleting permission' });
        }
    }

    // src/modules/permission/permission.controller.ts

    async getByIds(req: Request, res: Response): Promise<Response> {
        try {
            const ids: number[] = req.body.ids;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: 'Informe um array de IDs válido.' });
            }

            const permissions = await this.permissionService.findByIds(ids);

            return res.status(200).json({
                message: 'Permissões buscadas com sucesso',
                data: permissions,
            });
        } catch (error) {
            console.error('Erro ao buscar permissões por IDs:', error);
            return res.status(500).json({
                message: 'Erro interno ao buscar permissões por IDs',
            });
        }
    }

}
