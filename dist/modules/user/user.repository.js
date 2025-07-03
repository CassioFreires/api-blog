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
exports.UserRepository = void 0;
const ps_config_1 = __importDefault(require("../../config/ps.config"));
const user_entities_1 = __importDefault(require("./entities/user.entities"));
class UserRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(user_entities_1.default);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.repo.create(data); // cria instância com dados do DTO
                return yield this.repo.save(user); // salva no banco
            }
            catch (error) {
                console.error('Erro ao criar usuário no repositório:', error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.find({
                    relations: ['role']
                });
            }
            catch (error) {
                console.error('Erro ao buscar todos usuários no repositório:', error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.findOne({
                    where: { id },
                    relations: ['role']
                });
            }
            catch (error) {
                console.error(`Erro ao buscar usuário com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.findOne({
                    where: { email },
                    relations: ['role']
                });
            }
            catch (error) {
                console.error(`Erro ao buscar usuário email id ${email} no repositório:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repo.update(id, data);
                const updatedUser = yield this.getById(id);
                return updatedUser !== null && updatedUser !== void 0 ? updatedUser : null;
            }
            catch (error) {
                console.error(`Erro ao atualizar usuário com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repo.delete(id);
            }
            catch (error) {
                console.error(`Erro ao deletar usuário com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
