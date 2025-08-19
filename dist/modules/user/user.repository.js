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
const ps_config_1 = __importDefault(require("../../config/ps.config")); // sua instância do knex
class UserRepository {
    constructor() {
        this.tableName = 'users'; // Nome da tabela no banco
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [user] = yield (0, ps_config_1.default)(this.tableName)
                    .insert(data)
                    .returning('*'); // retorna os dados inseridos (Postgres)
                return user;
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
                return yield (0, ps_config_1.default)(this.tableName)
                    .select('*')
                    .leftJoin('roles', 'users.role_id', 'roles.id'); // exemplo com join
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
                const user = yield (0, ps_config_1.default)(this.tableName)
                    .where({ id })
                    .leftJoin('roles', 'users.role_id', 'roles.id')
                    .first();
                return user !== null && user !== void 0 ? user : null;
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
                const user = yield (0, ps_config_1.default)(this.tableName)
                    .where({ email })
                    .leftJoin('roles', 'users.role_id', 'roles.id')
                    .first();
                return user !== null && user !== void 0 ? user : null;
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
                yield (0, ps_config_1.default)(this.tableName).where({ id }).update(data);
                return yield this.getById(id);
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
                yield (0, ps_config_1.default)(this.tableName).where({ id }).del();
            }
            catch (error) {
                console.error(`Erro ao deletar usuário com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
