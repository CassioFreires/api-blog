// src/modules/friendship/friendship.repository.ts
import db from "../../config/ps.config";
import { IUser } from "../user/interfaces/user.interface";


export default class FriendshipRepository {
    private tableName = 'friendships'


    // Função para buscar pedidos de amizade pendentes
    async getPendingFriendships(idUser: number): Promise<any> {
        try {
            const requests = await db('friendships')
                // ✅ CORRIGIDO: Use 'friend_id' para buscar quem recebeu o pedido
                .where({ friend_id: idUser, status: 'pending' })
                .join('users', 'friendships.user_id', 'users.id')
                .select(
                    'friendships.id as friendshipId', // Renomeia para evitar conflito com o ID do usuário
                    'users.id',
                    'users.name',
                    'users.avatarUrl',
                    'users.bio'
                );
            return requests;
        } catch (error: any) {
            console.error('Erro no repositório ao buscar pedidos de amizade:', error);
            throw error;
        }
    }

    async getFriendshipSuggestions(userId: number): Promise<IUser[]> {
        try {
            // Passo 1: Obter os IDs de todos os usuários relacionados (amigos e pendentes)
            const relatedIds = await this.getRelatedUsers(userId);

            // Inclui o próprio ID do usuário para garantir que ele não seja retornado
            const excludeIds = [...relatedIds, userId];

            // Passo 2: Buscar usuários que NÃO estão na lista de IDs relacionados
            const users = await db('users')
                .select(
                    'users.id',
                    'users.name',
                    'users.lastName',
                    'users.email',
                    'users.bio',
                    'users.avatarUrl',
                    'roles.name as role_name',
                    'roles.description as role_description'
                )
                .leftJoin('roles', 'users.role_id', 'roles.id')
                .whereNotIn('users.id', excludeIds) // Filtra IDs que já têm uma relação
                .limit(20);

            return users;
        } catch (error) {
            console.error('Erro ao buscar sugestões de amizade:', error);
            throw error;
        }
    }

    // Função para buscar todos os amigos confirmados do usuário logado
    async getAcceptedFriends(userId: number): Promise<IUser[]> {
        try {
            const friends = await db('friendships')
                // Seleciona a coluna 'friend_id' para encontrar os amigos do usuário logado
                .select('friend_id')
                .where('user_id', userId)
                .andWhere('status', 'accepted');

            // Seleciona a coluna 'user_id' para encontrar os amigos que adicionaram o usuário logado
            const friendsOfFriends = await db('friendships')
                .select('user_id')
                .where('friend_id', userId)
                .andWhere('status', 'accepted');

            // Combina e obtém os IDs únicos de todos os amigos aceitos
            const allFriendIds = [...friends.map(f => f.friend_id), ...friendsOfFriends.map(f => f.user_id)];
            const uniqueFriendIds = [...new Set(allFriendIds)];

            // Busca os detalhes dos usuários a partir da lista de IDs
            const userDetails = await db('users')
                .select(
                    'users.id',
                    'users.name',
                    'users.lastName',
                    'users.email',
                    'users.bio',
                    'users.avatarUrl',
                    'roles.name as role_name',
                    'roles.description as role_description'
                )
                .leftJoin('roles', 'users.role_id', 'roles.id')
                .whereIn('users.id', uniqueFriendIds);

            return userDetails;

        } catch (error) {
            console.error('Erro ao buscar amigos no repositório:', error);
            throw error;
        }
    }

    // And the addFriend function you'll call from the service
    async addFriend(userId: number, friendId: number): Promise<void> {
        try {
            await db('friendships').insert({
                user_id: userId,
                friend_id: friendId,
                status: 'pending'
            });
        } catch (error) {
            console.error('Error adding friend to friendships table:', error);
            throw error;
        }
    }

    // Função para buscar os amigos do usuário logado
    async getFriends(userId: number): Promise<number[]> {
        const friendships = await db('friendships')
            .where('user_id', userId)
            .andWhere('status', 'accepted')
            .select('friend_id');

        // Retorna um array de IDs de amigos
        return friendships.map(friend => friend.friend_id);
    }


    // Nova função para buscar sugestões de amizade
    async getFriendshipStatus(userId: number, friendId: number): Promise<any | null> {
        // Check for both friendship directions to avoid duplicates
        const friendship = await db('friendships')
            .where(function () {
                this.where('user_id', userId).andWhere('friend_id', friendId);
            })
            .orWhere(function () {
                this.where('user_id', friendId).andWhere('friend_id', userId);
            })
            .first();

        return friendship || null;
    }

    // Retorna IDs de todos os usuários com quem o usuário logado tem uma relação
    async getRelatedUsers(userId: number): Promise<number[]> {
        const relatedIds = await db('friendships')
            .where('user_id', userId)
            .orWhere('friend_id', userId)
            .select('user_id', 'friend_id');

        // Converte o array de objetos em um array simples de IDs e remove duplicatas
        const allIds = relatedIds.flatMap(row => [row.user_id, row.friend_id]);
        const uniqueIds = [...new Set(allIds)].filter(id => id !== userId);

        return uniqueIds;
    }

    async getAcceptFriendShip(idUser: number): Promise<any> {
        try {
            // Buscando os amigos aceitos do usuário
            const friends = await db('friendships')
                .where({ user_id: idUser, status: 'accepted' })
                .join('users', 'friendships.friendship_id', 'users.id')
                .select(
                    'users.id',
                    'users.name',
                    'users.avatarUrl',
                    'users.bio'
                );
            return friends;
        } catch (error: any) {
            console.error('Erro no repositório ao buscar amigos aceitos:', error);
            throw error;
        }
    }

    async updateFriendshipStatus(friendshipId: number, status: 'accepted'): Promise<void> {
        try {
            await db(this.tableName)
                .where('id', friendshipId)
                .update({ status });
        } catch (error) {
            console.error('Erro no repositório ao atualizar status da amizade:', error);
            throw error;
        }
    }

    async deleteFriendship(friendshipId: number): Promise<void> {
        try {
            await db(this.tableName)
                .where('id', friendshipId)
                .del();
        } catch (error) {
            console.error('Erro no repositório ao deletar amizade:', error);
            throw error;
        }
    }


}