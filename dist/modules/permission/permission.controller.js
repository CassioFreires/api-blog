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
exports.PermissionController = void 0;
const create_permission_schema_1 = require("./schema/create-permission.schema");
class PermissionController {
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const resultPermission = yield this.permissionService.getByName(data.name);
                if (resultPermission) {
                    return res.status(400).json({ message: 'Name already in use' });
                }
                const validation = create_permission_schema_1.createPermissionSchema.safeParse(data);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: validation.error.flatten().fieldErrors,
                    });
                }
                const permission = yield this.permissionService.create(data);
                return res.status(201).json({ message: 'permission created', data: permission });
            }
            catch (error) {
                console.error('Error creating permission:', error);
                // Tratamento específico para erro de name duplicado (fallback caso falhe o getByName)
                if (error.code === '23505') {
                    return res.status(409).json({ message: 'Name already registered' });
                }
                return res.status(500).json({
                    message: 'Internal server error while creating role'
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield this.permissionService.getAll();
                console.log(permission);
                if (!permission || permission.length === 0) {
                    return res.status(404).json({ message: 'No permission found' });
                }
                return res.status(200).json({ message: 'permission fetched', data: permission });
            }
            catch (error) {
                console.error('Error fetching permission:', error);
                return res.status(500).json({ message: 'Internal server error while fetching permission' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const permission = yield this.permissionService.getById(id);
                if (!permission) {
                    return res.status(404).json({ message: 'permission not found' });
                }
                return res.status(200).json({ message: 'permission fetched', data: permission });
            }
            catch (error) {
                console.error('Error fetching permission by ID:', error);
                return res.status(500).json({ message: 'Internal server error while fetching permission by ID' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const permission = yield this.permissionService.update(id, data);
                if (!permission) {
                    return res.status(404).json({ message: 'permission not found or not updated' });
                }
                return res.status(200).json({ message: 'permission updated', data: permission });
            }
            catch (error) {
                console.error('Error updating permission:', error);
                return res.status(500).json({ message: 'Internal server error while updating permission' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const permission = yield this.permissionService.getById(id);
                if (!permission) {
                    return res.status(404).json({ message: 'permission not found', data: null });
                }
                yield this.permissionService.delete(id);
                return res.status(200).json({ message: 'permission deleted', data: permission });
            }
            catch (error) {
                console.error('Error deleting permission:', error);
                return res.status(500).json({ message: 'Internal server error while deleting permission' });
            }
        });
    }
    // src/modules/permission/permission.controller.ts
    getByIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ids = req.body.ids;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).json({ message: 'Informe um array de IDs válido.' });
                }
                const permissions = yield this.permissionService.findByIds(ids);
                return res.status(200).json({
                    message: 'Permissões buscadas com sucesso',
                    data: permissions,
                });
            }
            catch (error) {
                console.error('Erro ao buscar permissões por IDs:', error);
                return res.status(500).json({
                    message: 'Erro interno ao buscar permissões por IDs',
                });
            }
        });
    }
}
exports.PermissionController = PermissionController;
