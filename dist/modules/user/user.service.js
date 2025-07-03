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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const hashPassword_1 = require("./utils/hashPassword");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield (0, hashPassword_1.hashPassword)(data.password_hash);
                const newData = {
                    name: data.name.toLocaleLowerCase(),
                    fullName: data.fullName.toLocaleLowerCase(),
                    email: data.email.toLocaleLowerCase(),
                    password_hash: hashedPassword,
                    bio: data === null || data === void 0 ? void 0 : data.bio,
                    avatarUrl: data === null || data === void 0 ? void 0 : data.avatarUrl,
                    role_id: data.role_id
                };
                return yield this.userRepository.create(newData);
            }
            catch (error) {
                console.error('Erro ao criar usuário:', error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAll();
            }
            catch (error) {
                console.error('Erro ao buscar todos usuários:', error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getById(id); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar usuário com id ${id}:`, error);
                throw error;
            }
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getByEmail(email); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar usuário com email ${email}:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.update(id, data);
                return yield this.userRepository.getById(id); // pode retornar null
            }
            catch (error) {
                console.error(`Erro ao atualizar usuário com id ${id}:`, error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.delete(id);
            }
            catch (error) {
                console.error(`Erro ao deletar usuário com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.UserService = UserService;
