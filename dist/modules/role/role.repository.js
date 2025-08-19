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
exports.RoleRepository = void 0;
const ps_config_1 = __importDefault(require("../../config/ps.config")); // instância do knex
class RoleRepository {
    constructor() {
        this.table = "roles"; // Nome da tabela no banco
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [role] = yield (0, ps_config_1.default)(this.table)
                    .insert(data)
                    .returning("*"); // PostgreSQL: retorna a linha inserida
                return role;
            }
            catch (error) {
                console.error("Erro ao criar role:", error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, ps_config_1.default)(this.table).select("*");
            }
            catch (error) {
                console.error("Erro ao buscar todas as roles:", error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield (0, ps_config_1.default)(this.table).where({ id }).first();
                return role !== null && role !== void 0 ? role : null;
            }
            catch (error) {
                console.error(`Erro ao buscar role com id ${id}:`, error);
                throw error;
            }
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = yield (0, ps_config_1.default)(this.table).where({ name }).first();
                return role !== null && role !== void 0 ? role : null;
            }
            catch (error) {
                console.error(`Erro ao buscar role com nome ${name}:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, ps_config_1.default)(this.table).where({ id }).update(data);
                return yield this.getById(id);
            }
            catch (error) {
                console.error(`Erro ao atualizar role com id ${id}:`, error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, ps_config_1.default)(this.table).where({ id }).delete();
            }
            catch (error) {
                console.error(`Erro ao deletar role com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.RoleRepository = RoleRepository;
