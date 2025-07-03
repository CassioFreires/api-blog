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
exports.RolePermissionService = void 0;
const role_permission_repository_1 = require("./role-permission.repository");
class RolePermissionService {
    constructor() {
        this.rolePermissionRepository = new role_permission_repository_1.RolePermissionRepository();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = {
                    role_id: data.role_id,
                    permission_id: data.permission_id,
                };
                return yield this.rolePermissionRepository.create(newData);
            }
            catch (error) {
                console.error('Erro ao criar role permission:', error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.rolePermissionRepository.getAll();
            }
            catch (error) {
                console.error('Erro ao buscar todos roles:', error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.rolePermissionRepository.getById(id); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar role permission com id ${id}:`, error);
                throw error;
            }
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role_id, permission_id } = data;
                if (!permission_id || permission_id.length === 0) {
                    throw new Error('Permissões não fornecidas.');
                }
                return yield this.rolePermissionRepository.update(data);
            }
            catch (error) {
                console.error(`Erro ao atualizar role permission:`, error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.rolePermissionRepository.delete(id);
            }
            catch (error) {
                console.error(`Erro ao deletar role permission com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.RolePermissionService = RolePermissionService;
