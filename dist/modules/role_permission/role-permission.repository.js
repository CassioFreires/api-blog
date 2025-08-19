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
const ps_config_1 = __importDefault(require("../../config/ps.config")); // instância do Knex
class RolePermissionRepository {
    constructor() {
        this.table = "role_permissions";
        this.roleTable = "roles";
        this.permissionTable = "permissions";
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_id, permission_id } = data;
                const ids = Array.isArray(permission_id) ? permission_id : [permission_id];
                // Verifica se a role existe
                const roleExists = yield (0, ps_config_1.default)(this.roleTable).where({ id: role_id }).first();
                if (!roleExists) {
                    console.error(`Role com id ${role_id} não encontrada.`);
                    return null;
                }
                // Verifica se as permissions existem
                const foundPermissions = yield (0, ps_config_1.default)(this.permissionTable)
                    .whereIn("id", ids)
                    .select("id");
                const foundIds = foundPermissions.map(p => p.id);
                const notFound = ids.filter(id => !foundIds.includes(id));
                if (notFound.length > 0) {
                    console.error(`Permissions não encontradas: ${notFound.join(", ")}`);
                    return null;
                }
                // Cria as associações role-permission
                const entries = ids.map(pid => ({
                    role_id,
                    permission_id: pid,
                }));
                const inserted = yield (0, ps_config_1.default)(this.table)
                    .insert(entries)
                    .returning("*");
                return inserted;
            }
            catch (error) {
                console.error("Erro ao criar role_permission:", error);
                return null;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, ps_config_1.default)(this.table).select("*");
            }
            catch (error) {
                console.error("Erro ao buscar todas as role_permissions:", error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, ps_config_1.default)(this.table).where({ id }).first();
                return result !== null && result !== void 0 ? result : null;
            }
            catch (error) {
                console.error(`Erro ao buscar role_permission com id ${id}:`, error);
                throw error;
            }
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_id, permission_id } = data;
                if (!permission_id || !Array.isArray(permission_id) || permission_id.length === 0) {
                    throw new Error("Permissões não fornecidas para atualização.");
                }
                // Remove todas as permissões existentes para a role
                yield (0, ps_config_1.default)(this.table).where({ role_id }).delete();
                // Insere as novas permissões
                const newPermissions = permission_id.map(pid => ({
                    role_id,
                    permission_id: pid,
                }));
                const inserted = yield (0, ps_config_1.default)(this.table)
                    .insert(newPermissions)
                    .returning("*");
                return inserted;
            }
            catch (error) {
                console.error(`Erro ao atualizar role_permission para role_id ${data.role_id}:`, error);
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
                console.error(`Erro ao deletar role_permission com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.RolePermissionRepository = RolePermissionRepository;
