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
const role_entities_1 = require("./entities/role.entities");
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class RoleRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(role_entities_1.RoleEntity);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const role = this.repo.create(data); // cria instância com dados do DTO
                return yield this.repo.save(role); // salva no banco
            }
            catch (error) {
                console.error('Erro ao criar role no repositório:', error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.find();
            }
            catch (error) {
                console.error('Erro ao buscar todos roles no repositório:', error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.findOneBy({ id });
            }
            catch (error) {
                console.error(`Erro ao buscar role com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.findOneBy({ name });
            }
            catch (error) {
                console.error(`Erro ao buscar role name id ${name} no repositório:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repo.update(id, data);
                const updateRole = yield this.getById(id);
                return updateRole !== null && updateRole !== void 0 ? updateRole : null;
            }
            catch (error) {
                console.error(`Erro ao atualizar role com id ${id} no repositório:`, error);
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
                console.error(`Erro ao deletar role com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
}
exports.RoleRepository = RoleRepository;
