import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user';
import { IUser } from './interfaces/user.interface';
import { validationUpdateUser } from './schema/update-user.schema';
import fs from 'fs';
import path from 'path';

export class UserController {
    constructor(private readonly userService: UserService) { }

    async create(req: Request, res: Response): Promise<Response<IUser>> {
        try {
            const data: CreateUserDTO = req.body;

            const resultUser = await this.userService.getByEmail(data.email);
            if (resultUser) {
                return res.status(400).json({ message: 'Email já está em uso' });
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


            // Segurança: só pode atualizar o próprio perfil
            if (userIdFromToken !== idToUpdate) {
                return res.status(403).json({ message: "Acesso negado" });
            }

            // Busca usuário existente
            const existingUser = await this.userService.getById(idToUpdate);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Se houver upload de nova imagem
            if (req.file) {
                // Deleta avatar antigo se existir
                if (existingUser.avatarUrl) {
                    const oldPath = path.join(process.cwd(), existingUser.avatarUrl);
                    fs.unlink(oldPath, (err) => {
                        if (err) return console.warn("Erro ao deletar avatar antigo:", err);
                        console.log("Avatar antigo deletado com sucesso!");
                    });
                }

                // Atualiza o campo da imagem
                data.avatarUrl = `/uploads/imgAvatars/${req.file.filename}`;
            }

            // Atualiza usuário
            const updatedUser = await this.userService.update(idToUpdate, data);

            if (!updatedUser) {
                return res.status(404).json({ message: "Usuário não atualizado" });
            }

            return res.status(200).json(updatedUser);

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

    async getFriendshipSuggestions(req: Request, res: Response): Promise<any> {
        try {
            // Obtenha o ID do usuário logado
            const userId = Number(req.user?.user.id);

            // ✅ VERIFICAÇÃO CRÍTICA: Checa se o userId é um número válido
            if (isNaN(userId)) {
                return res.status(401).json({ message: 'Usuário não autenticado ou ID inválido.' });
            }

            const suggestions = await this.userService.getFriendshipSuggestions(userId);

            if (!suggestions || suggestions.length === 0) {
                return res.status(200).json({ message: 'Não há sugestões de amizade no momento', data: [] });
            }

            return res.status(200).json({ message: 'Sugestões de amizade retornadas com sucesso', data: suggestions });
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao buscar sugestões de amizade: ' + error.message });
        }
    }

    async addFriends(req: Request, res: Response): Promise<any> {
        try {
            const userId = Number(req.user?.user.id);
            const { friendId } = req.body;

            // Basic validation
            if (!friendId || isNaN(friendId) || isNaN(userId)) {
                return res.status(400).json({ message: 'Invalid friend ID or user ID.' });
            }

            await this.userService.addFriend(userId, friendId);

            return res.status(201).json({ message: 'Friendship request sent successfully.' });
        } catch (error: any) {
            console.error('Error adding friend:', error);
            // Return specific errors for better client feedback
            if (error.message.includes('Cannot add yourself')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('Friendship request already sent')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error while adding friend.' });
        }
    }
    
    async getAcceptedFriends(req: Request, res: Response): Promise<any> {
        try {
            const userId = Number(req.user?.user.id);

            if (isNaN(userId)) {
                return res.status(401).json({ message: 'Usuário não autenticado ou ID inválido.' });
            }

            const friends = await this.userService.getAcceptedFriends(userId);

            return res.status(200).json({ message: 'Lista de amigos retornada com sucesso.', data: friends });
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao buscar a lista de amigos: ' + error.message });
        }
    }

}
