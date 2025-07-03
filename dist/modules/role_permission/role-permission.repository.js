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
exports.RolePermissionRepository = void 0;
const create_role_permission_1 = require("./entities/create-role-permission");
const ps_config_1 = __importDefault(require("../../config/ps.config"));
const role_entities_1 = require("../role/entities/role.entities");
const permission_entitie_1 = require("../permission/entities/permission.entitie");
class RolePermissionRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(create_role_permission_1.RolePermissionEntity);
        this.repoRole = ps_config_1.default.getRepository(role_entities_1.RoleEntity);
        this.repoPermission = ps_config_1.default.getRepository(permission_entitie_1.PermissionEntity);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_id, permission_id } = data;
                // Verifica se a role existe
                const roleExists = yield this.repoRole.findOneBy({ id: role_id });
                if (!roleExists) {
                    console.error(`Role com id ${role_id} não encontrado.`);
                    return null;
                }
                const ids = Array.isArray(permission_id) ? permission_id : [permission_id];
                // Verifica se as permissões existem
                const foundPermissions = yield this.repoPermission.findByIds(ids);
                console.log(foundPermissions);
                const foundIds = foundPermissions.map(p => p.id);
                const notFound = ids.filter(id => !foundIds.includes(id));
                if (notFound.length > 0) {
                    console.error(`Permissions não encontradas: ${notFound.join(', ')}`);
                    return null;
                }
                const entries = ids.map((pid) => {
                    const entity = new create_role_permission_1.RolePermissionEntity();
                    entity.role_id = role_id;
                    entity.permission_id = pid;
                    return entity;
                });
                return yield this.repo.save(entries);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Erro ao criar role permission no repositório:', error.message);
                }
                else {
                    console.error('Erro desconhecido ao criar role permission:', error);
                }
                return null;
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
                console.error(`Erro ao buscar role permission com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_id, permission_id } = data;
                if (!permission_id || !Array.isArray(permission_id) || permission_id.length === 0) {
                    throw new Error('Permissões não fornecidas para atualização.');
                }
                yield this.repo.delete({ role_id });
                const newPermissions = permission_id.map(pid => {
                    const entity = new create_role_permission_1.RolePermissionEntity();
                    entity.role_id = role_id;
                    entity.permission_id = pid;
                    return entity;
                });
                return yield this.repo.save(newPermissions);
            }
            catch (error) {
                console.error(`Erro ao atualizar role permission para role_id ${data.role_id}:`, error);
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
                console.error(`Erro ao deletar role permission com id ${id} no repositório:`, error);
                throw error;
            }
        });
    }
}
exports.RolePermissionRepository = RolePermissionRepository;
