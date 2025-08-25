import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user';
import { IUser } from './interfaces/user.interface';
import { validationUpdateUser } from './schema/update-user.schema';

export class UserController {
    constructor(private readonly userService: UserService) { }

    async create(req: Request, res: Response): Promise<Response<IUser>> {
        try {
            const data: CreateUserDTO = req.body;

            const resultUser = await this.userService.getByEmail(data.email);
            if (resultUser) {
                return res.status(400).json({ message: 'Email já está em uso'});
            }

            const validation = validationUpdateUser.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: validation.error.flatten().fieldErrors,
                });
            }

            const user = await this.userService.create(data);
            return res.status(201).json({ message: 'Usuário criado', data: user });
        } catch (error: any) {
            console.error('Error creating user:', error);
            // Tratamento específico para erro de e-mail duplicado (fallback caso falhe o getByEmail)
            if (error.code === '23505') {
                return res.status(409).json({ message: 'E-mail já registrado' });
            }

            return res.status(500).json({
                message: 'Internal server error while creating user'
            });
        }
    }


    async getAll(req: Request, res: Response): Promise<Response<IUser>> {
        try {
            const users = await this.userService.getAll();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            return res.status(200).json({ message: 'Users fetched', data: users });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal server error while fetching users' });
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IUser>> {
        try {
            const id = Number(req.params.id);
            const user = await this.userService.getById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User fetched', data: user });
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return res.status(500).json({ message: 'Internal server error while fetching user by ID' });
        }
    }

    async update(req: Request, res: Response): Promise<Response<IUser | { message: string }>> {
        try {
            const id = Number(req.params.id);
            const data: UpdateUserDTO = req.body;
            const userIdFromToken = Number(req.user?.user.id);
            const idToUpdate = Number(req.params.id)

            if (userIdFromToken !== idToUpdate) {
                return res.status(403).json({ message: "Acesso negado" });
            }


            const user = await this.userService.update(id, data);

            if (!user) {
                return res.status(404).json({ message: "User not found or not updated" });
            }

            // ✅ Retorna só o usuário atualizado
            return res.status(200).json(user);

        } catch (error) {
            console.error("Error updating user:", error);
            return res
                .status(500)
                .json({ message: "Internal server error while updating user" });
        }
    }


    async delete(req: Request, res: Response): Promise<Response<IUser>> {
        try {
            const id = Number(req.params.id);
            const user = await this.userService.getById(id);
            if (!user) { return res.status(404).json({ message: 'User not found', data: null }) }
            await this.userService.delete(id);
            return res.status(200).json({ message: 'User deleted', data: user });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Internal server error while deleting user' });
        }
    }
}
