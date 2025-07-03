"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_entities_1 = __importDefault(require("../user/entities/user.entities"));
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class AuthRepository {
    constructor() {
        this.userRepo = ps_config_1.default.getRepository(user_entities_1.default);
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.userRepo.create(data);
                return yield this.userRepo.save(user);
            }
            catch (error) {
                console.error('Erro ao criar usuário no repositório:', error);
                throw new Error('Erro ao salvar usuário no banco de dados.');
            }
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email)
                    throw new Error("Email é obrigatório para buscar usuário.");
                return yield this.userRepo.findOne({ where: { email } });
            }
            catch (error) {
                console.error('Erro ao buscar usuário por email:', error);
                throw new Error('Erro ao buscar usuário por email.');
            }
        });
    }
    findByEmailWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!email)
                    throw new Error("Email é obrigatório.");
                return yield this.userRepo.findOne({
                    where: { email },
                    select: [
                        'id', 'name', 'fullName', 'email', 'password_hash',
                        'twoFactorSecret', 'isTwoFactorEnabled', 'refreshToken'
                    ]
                });
            }
            catch (error) {
                console.error('Erro ao buscar usuário com senha:', error);
                throw new Error('Erro ao buscar usuário com senha.');
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || typeof id !== 'number')
                    throw new Error("ID inválido.");
                return yield this.userRepo.findOne({
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
            }
            catch (error) {
                console.error('Erro ao buscar usuário por ID:', error);
                throw new Error('Erro ao buscar usuário por ID.');
            }
        });
    }
    updateTwoFactorSecret(id, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || !secret)
                    throw new Error("ID e segredo são obrigatórios.");
                yield this.userRepo.update(id, {
                    twoFactorSecret: secret,
                    isTwoFactorEnabled: true
                });
            }
            catch (error) {
                console.error('Erro ao atualizar 2FA:', error);
                throw new Error('Erro ao atualizar chave 2FA do usuário.');
            }
        });
    }
    updateRefreshToken(id, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id || !refreshToken)
                    throw new Error("ID e refresh token são obrigatórios.");
                return yield this.userRepo.update(id, { refreshToken });
            }
            catch (error) {
                console.error('Erro ao atualizar refresh token:', error);
                throw new Error('Erro ao atualizar o refresh token do usuário.');
            }
        });
    }
    clearRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepo.update(userId, { refreshToken: '' });
            }
            catch (error) {
                console.error("Erro ao limpar o refresh token:", error);
                throw new Error("Erro ao realizar logout no banco de dados.");
            }
        });
    }
}
exports.default = AuthRepository;
