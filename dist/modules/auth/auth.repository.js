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
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class AuthRepository {
    constructor() {
        this.table = "users";
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [insertedId] = yield (0, ps_config_1.default)(this.table).insert(data);
                const user = yield this.findById(insertedId);
                return user;
            }
            catch (error) {
                console.error("Erro ao criar usuário no repositório:", error);
                throw new Error("Erro ao salvar usuário no banco de dados.");
            }
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new Error("Email é obrigatório para buscar usuário.");
            try {
                return yield (0, ps_config_1.default)(this.table).where({ email }).first();
            }
            catch (error) {
                console.error("Erro ao buscar usuário por email:", error);
                throw new Error("Erro ao buscar usuário por email.");
            }
        });
    }
    findByEmailWithPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new Error("Email é obrigatório.");
            try {
                return yield (0, ps_config_1.default)('users')
                    .select('users.id', 'users.name', 'users.lastName', 'users.email', 'users.password_hash', 'users.twoFactorSecret', 'users.isTwoFactorEnabled', 'users.refreshToken', 'users.bio', 'users.avatarUrl', 'users.role_id', 'roles.name as role_name', 'roles.description as role_description')
                    .leftJoin('roles', 'users.role_id', 'roles.id')
                    .where('users.email', email)
                    .first();
            }
            catch (error) {
                console.error('Erro ao buscar usuário com senha:', error);
                throw new Error('Erro ao buscar usuário com senha.');
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || typeof id !== "number")
                throw new Error("ID inválido.");
            try {
                // Supondo que você tenha tabelas 'roles', 'role_permissions', 'permissions'
                // Para trazer dados relacionados, faça joins. Exemplo básico:
                const user = yield (0, ps_config_1.default)(this.table)
                    .select(`${this.table}.*`, "roles.name as role_name", "permissions.name as permission_name")
                    .leftJoin("roles", `${this.table}.role_id`, "roles.id")
                    .leftJoin("role_permissions", "roles.id", "role_permissions.role_id")
                    .leftJoin("permissions", "role_permissions.permission_id", "permissions.id")
                    .where(`${this.table}.id`, id)
                    .first();
                return user;
            }
            catch (error) {
                console.error("Erro ao buscar usuário por ID:", error);
                throw new Error("Erro ao buscar usuário por ID.");
            }
        });
    }
    updateTwoFactorSecret(id, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !secret)
                throw new Error("ID e segredo são obrigatórios.");
            try {
                yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .update({
                    twoFactorSecret: secret,
                    isTwoFactorEnabled: true,
                    updated_at: ps_config_1.default.fn.now(),
                });
            }
            catch (error) {
                console.error("Erro ao atualizar 2FA:", error);
                throw new Error("Erro ao atualizar chave 2FA do usuário.");
            }
        });
    }
    updateRefreshToken(id, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !refreshToken)
                throw new Error("ID e refresh token são obrigatórios.");
            try {
                yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .update({ refreshToken, updated_at: ps_config_1.default.fn.now() });
            }
            catch (error) {
                console.error("Erro ao atualizar refresh token:", error);
                throw new Error("Erro ao atualizar o refresh token do usuário.");
            }
        });
    }
    clearRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, ps_config_1.default)(this.table)
                    .where({ id: userId })
                    .update({ refreshToken: "", updated_at: ps_config_1.default.fn.now() });
            }
            catch (error) {
                console.error("Erro ao limpar o refresh token:", error);
                throw new Error("Erro ao realizar logout no banco de dados.");
            }
        });
    }
}
exports.default = AuthRepository;
