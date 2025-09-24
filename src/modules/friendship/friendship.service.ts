// src/modules/friendship/friendship.service.ts
import FriendshipRepository from './friendship.repository';
import { IUser } from '../user/interfaces/user.interface';

export default class FriendshipService {
    private readonly friendshipRepository = new FriendshipRepository();

    async getAcceptFriendShip(idUser: number): Promise<any> {
        try {
            // Chama a função do repositório para buscar os amigos
            const friends = await this.friendshipRepository.getAcceptFriendShip(idUser);
            return friends;
        } catch (error: any) {
            console.error('Erro no serviço ao buscar amigos aceitos:', error);
            throw error;
        }
    }

    async getPendingFriendships(idUser: number): Promise<any> {
        try {
            const requests = await this.friendshipRepository.getPendingFriendships(idUser);
            return requests;
        } catch (error: any) {
            console.error('Erro no serviço ao buscar pedidos de amizade:', error);
            throw error;
        }
    }

    async getFriendshipSuggestions(userId: number): Promise<IUser[]> {
        try {
            return await this.friendshipRepository.getFriendshipSuggestions(userId);
        } catch (error: any) {
            // Centraliza o tratamento de erro
            console.error('Erro no serviço ao buscar sugestões:', error);
            throw new Error('Erro ao buscar sugestões de amizade.');
        }
    }

    async getAcceptedFriends(userId: number): Promise<IUser[]> {
        try {
            return await this.friendshipRepository.getAcceptedFriends(userId);
        } catch (error: any) {
            console.error('Erro no serviço ao buscar amigos:', error);
            throw new Error('Erro ao buscar a lista de amigos.');
        }
    }


    async addFriend(userId: number, friendId: number): Promise<void> {
        try {
            // 1. Prevent a user from adding themselves
            if (userId === friendId) {
                throw new Error('Cannot add yourself as a friend.');
            }

            // 2. Check if a pending or accepted friendship already exists
            const existingFriendship = await this.friendshipRepository.getFriendshipStatus(userId, friendId);
            if (existingFriendship) {
                throw new Error('Friendship request already sent or user is already your friend.');
            }

            // 3. Insert the new friendship entry
            await this.friendshipRepository.addFriend(userId, friendId);

        } catch (error) {
            console.error('Error in service layer while adding friend:', error);
            throw error;
        }
    }

    async acceptFriendship(userId: number, friendshipId: number): Promise<void> {
        try {
            await this.friendshipRepository.updateFriendshipStatus(friendshipId, 'accepted');
        } catch (error) {
            console.error('Erro no serviço ao aceitar pedido:', error);
            throw error;
        }
    }

    async rejectFriendship(userId: number, friendshipId: number): Promise<void> {
        try {
            await this.friendshipRepository.deleteFriendship(friendshipId);
        } catch (error) {
            console.error('Erro no serviço ao rejeitar pedido:', error);
            throw error;
        }
    }
}