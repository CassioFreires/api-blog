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
exports.RolePermissionController = void 0;
const create_role_permission_schema_1 = require("./schema/create-role-permission.schema");
class RolePermissionController {
    constructor(rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const validation = create_role_permission_schema_1.createRolePermissionSchema.safeParse(data);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: validation.error.flatten().fieldErrors,
                    });
                }
                const rolePermission = yield this.rolePermissionService.create(data);
                return res.status(201).json({ message: 'role permission created', data: rolePermission });
            }
            catch (error) {
                console.error('Error creating role permission:', error);
                // Tratamento específico para erro de name duplicado (fallback caso falhe o getByName)
                if (error.code === '23505') {
                    return res.status(409).json({ message: 'Role permission already registered' });
                }
                return res.status(500).json({
                    message: 'Internal server error while creating role permission'
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rolePermissions = yield this.rolePermissionService.getAll();
                if (!rolePermissions || rolePermissions.length === 0) {
                    return res.status(404).json({ message: 'No role permissions found' });
                }
                return res.status(200).json({ message: 'role permissions fetched', data: rolePermissions });
            }
            catch (error) {
                console.error('Error fetching role permissions:', error);
                return res.status(500).json({ message: 'Internal server error while fetching role permissions' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const rolePermission = yield this.rolePermissionService.getById(id);
                if (!rolePermission) {
                    return res.status(404).json({ message: 'role permission not found' });
                }
                return res.status(200).json({ message: 'role permission fetched', data: rolePermission });
            }
            catch (error) {
                console.error('Error fetching role permission by ID:', error);
                return res.status(500).json({ message: 'Internal server error while fetching role permission by ID' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.role_id || !Array.isArray(data.permission_id) || data.permission_id.length === 0) {
                    return res.status(400).json({ message: 'Dados inválidos para atualização de permissões' });
                }
                const rolePermission = yield this.rolePermissionService.update(data);
                return res.status(200).json({ message: 'Role permissions atualizadas com sucesso', data: rolePermission });
            }
            catch (error) {
                console.error('Erro ao atualizar role permission:', error);
                return res.status(500).json({ message: 'Erro interno ao atualizar role permission' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const rolePermission = yield this.rolePermissionService.getById(id);
                if (!rolePermission) {
                    return res.status(404).json({ message: 'role permission not found', data: null });
                }
                yield this.rolePermissionService.delete(id);
                return res.status(200).json({ message: 'role permission deleted', data: rolePermission });
            }
            catch (error) {
                console.error('Error deleting role permission:', error);
                return res.status(500).json({ message: 'Internal server error while deleting role permission' });
            }
        });
    }
}
exports.RolePermissionController = RolePermissionController;
