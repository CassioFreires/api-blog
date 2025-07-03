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
exports.PermissionRepository = void 0;
const permission_entitie_1 = require("./entities/permission.entitie");
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class PermissionRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(permission_entitie_1.PermissionEntity);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = this.repo.create(data); // cria instância com dados do DTO
                return yield this.repo.save(permission); // salva no banco
            }
            catch (error) {
                console.error('Erro ao criar permission no repositório:', error);
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
                console.error('Erro ao buscar todos permission no repositório:', error);
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
                console.error(`Erro ao buscar permission com id ${id} no repositório:`, error);
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
                console.error(`Erro ao buscar permission name id ${name} no repositório:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repo.update(id, data);
                const updatePermission = yield this.getById(id);
                return updatePermission !== null && updatePermission !== void 0 ? updatePermission : null;
            }
            catch (error) {
                console.error(`Erro ao atualizar permission com id ${id} no repositório:`, error);
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
                console.error(`Erro ao deletar permission com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
    findByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.findByIds(ids);
            }
            catch (error) {
                console.error('Erro ao buscar permissões pelos IDs:', error);
                throw error;
            }
        });
    }
}
exports.PermissionRepository = PermissionRepository;
