import { Repository } from "typeorm";
import UserEntity from "../user/entities/user.entities";
import { SignupAuthDto } from "./dto/signup.dto";
import PsDatabase from "../../config/ps.config";

export default class AuthRepository {
    private userRepo: Repository<UserEntity>;

    constructor() {
        this.userRepo = PsDatabase.getRepository(UserEntity);
    }

    async signup(data: SignupAuthDto) {
        try {
            const user = this.userRepo.create(data);
            return await this.userRepo.save(user);
        } catch (error) {
            console.error('Erro ao criar usuário no repositório:', error);
            throw new Error('Erro ao salvar usuário no banco de dados.');
        }
    }

    async getByEmail(email: string) {
        try {
            if (!email) throw new Error("Email é obrigatório para buscar usuário.");
            return await this.userRepo.findOne({ where: { email } });
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw new Error('Erro ao buscar usuário por email.');
        }
    }

    async findByEmailWithPassword(email: string) {
        try {
            if (!email) throw new Error("Email é obrigatório.");
            return await this.userRepo.findOne({
                where: { email },
                select: [
                    'id', 'name', 'fullName', 'email', 'password_hash',
                    'twoFactorSecret', 'isTwoFactorEnabled', 'refreshToken'
                ]
            });
        } catch (error) {
            console.error('Erro ao buscar usuário com senha:', error);
            throw new Error('Erro ao buscar usuário com senha.');
        }
    }

    async findById(id: number) {
        try {
            if (!id || typeof id !== 'number') throw new Error("ID inválido.");

            return await this.userRepo.findOne({
                where: { id },
                relations: {
                    role: {
                        rolePermission: {
                            permission: true
                        }
                    }
                },
                select: [
                    'id', 'name', 'fullName', 'email', 'password_hash',
                    'twoFactorSecret', 'isTwoFactorEnabled',
                    'refreshToken', 'role_id'
                ]
            });
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw new Error('Erro ao buscar usuário por ID.');
        }
    }

    async updateTwoFactorSecret(id: number, secret: string) {
        try {
            if (!id || !secret) throw new Error("ID e segredo são obrigatórios.");
            await this.userRepo.update(id, {
                twoFactorSecret: secret,
                isTwoFactorEnabled: true
            });
        } catch (error) {
            console.error('Erro ao atualizar 2FA:', error);
            throw new Error('Erro ao atualizar chave 2FA do usuário.');
        }
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        try {
            if (!id || !refreshToken) throw new Error("ID e refresh token são obrigatórios.");
            return await this.userRepo.update(id, { refreshToken });
        } catch (error) {
            console.error('Erro ao atualizar refresh token:', error);
            throw new Error('Erro ao atualizar o refresh token do usuário.');
        }
    }

     async clearRefreshToken(userId: number): Promise<void> {
        try {
            await this.userRepo.update(userId, { refreshToken: '' });
        } catch (error) {
            console.error("Erro ao limpar o refresh token:", error);
            throw new Error("Erro ao realizar logout no banco de dados.");
        }
    }

}
