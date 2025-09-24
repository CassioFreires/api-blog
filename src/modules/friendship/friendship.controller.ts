// src/modules/friendship/friendship.controller.ts
import { Request, Response } from 'express';
import FriendshipService from './friendship.service';

export default class FriendshipController {
    private readonly friendshipService = new FriendshipService();

    // Função para buscar os pedidos de amizade aceitos
    async getAcceptFriendShip(req: Request, res: Response): Promise<any> {
        try {
            // Extrai o ID do usuário autenticado do objeto da requisição
            const idUser = Number(req.user?.user.id);
            if (!idUser) {
                return res.status(401).json({ message: 'Usuário não autenticado.' });
            }

            // Chama o serviço para obter a lista de amigos aceitos
            const friends = await this.friendshipService.getAcceptFriendShip(idUser);

            if (!friends || friends.length === 0) {
                return res.status(404).json({ message: 'Você ainda não tem amigos adicionados.' });
            }

            return res.status(200).json({
                message: 'Amigos aceitos encontrados com sucesso.',
                data: friends,
            });
        } catch (error: any) {
            console.error('Erro no controller ao buscar amigos:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    // Função para obter os pedidos de amizade pendentes
    async getPendingFriendships(req: Request, res: Response): Promise<any> {
        try {
            const idUser = Number(req.user?.user.id);
            if (!idUser) {
                return res.status(401).json({ message: 'Usuário não autenticado.' });
            }

            const requests = await this.friendshipService.getPendingFriendships(idUser);

            if (!requests || requests.length === 0) {
                return res.status(200).json({
                    message: 'Você não tem pedidos de amizade pendentes.',
                    data: []
                });
            }

            return res.status(200).json({
                message: 'Pedidos de amizade encontrados com sucesso.',
                data: requests,
            });
        } catch (error: any) {
            console.error('Erro no controller ao buscar pedidos de amizade:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
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

            const suggestions = await this.friendshipService.getFriendshipSuggestions(userId);

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

            await this.friendshipService.addFriend(userId, friendId);

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

            const friends = await this.friendshipService.getAcceptedFriends(userId);

            return res.status(200).json({ message: 'Lista de amigos retornada com sucesso.', data: friends });
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao buscar a lista de amigos: ' + error.message });
        }
    }

    // Método para aceitar um pedido de amizade
    async acceptFriendship(req: Request, res: Response): Promise<any> {
        try {
            const userId = Number(req.user?.user.id);
            const friendshipId = Number(req.params.id);

            if (isNaN(userId) || isNaN(friendshipId)) {
                return res.status(400).json({ message: 'ID de usuário ou amizade inválido.' });
            }

            await this.friendshipService.acceptFriendship(userId, friendshipId);

            return res.status(200).json({ message: 'Pedido de amizade aceito com sucesso.' });
        } catch (error: any) {
            console.error('Erro ao aceitar pedido de amizade:', error);
            return res.status(500).json({ message: 'Erro ao aceitar o pedido de amizade: ' + error.message });
        }
    }

    // Método para rejeitar um pedido de amizade
    async rejectFriendship(req: Request, res: Response): Promise<any> {
        try {
            const userId = Number(req.user?.user.id);
            const friendshipId = Number(req.params.id);

            if (isNaN(userId) || isNaN(friendshipId)) {
                return res.status(400).json({ message: 'ID de usuário ou amizade inválido.' });
            }

            await this.friendshipService.rejectFriendship(userId, friendshipId);

            return res.status(200).json({ message: 'Pedido de amizade rejeitado com sucesso.' });
        } catch (error: any) {
            console.error('Erro ao rejeitar pedido de amizade:', error);
            return res.status(500).json({ message: 'Erro ao rejeitar o pedido de amizade: ' + error.message });
        }
    }


}