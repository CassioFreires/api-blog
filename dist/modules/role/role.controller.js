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
exports.RoleController = void 0;
const create_role_schema_1 = require("./schema/create-role.schema");
class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const resultRole = yield this.roleService.getByName(data.name);
                if (resultRole) {
                    return res.status(400).json({ message: 'Name already in use' });
                }
                const validation = create_role_schema_1.createRoleSchema.safeParse(data);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: validation.error.flatten().fieldErrors,
                    });
                }
                const role = yield this.roleService.create(data);
                return res.status(201).json({ message: 'Role created', data: role });
            }
            catch (error) {
                console.error('Error creating Role:', error);
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
                const roles = yield this.roleService.getAll();
                console.log(roles);
                if (!roles || roles.length === 0) {
                    return res.status(404).json({ message: 'No roles found' });
                }
                return res.status(200).json({ message: 'roles fetched', data: roles });
            }
            catch (error) {
                console.error('Error fetching roles:', error);
                return res.status(500).json({ message: 'Internal server error while fetching roles' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const role = yield this.roleService.getById(id);
                if (!role) {
                    return res.status(404).json({ message: 'role not found' });
                }
                return res.status(200).json({ message: 'role fetched', data: role });
            }
            catch (error) {
                console.error('Error fetching role by ID:', error);
                return res.status(500).json({ message: 'Internal server error while fetching role by ID' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const role = yield this.roleService.update(id, data);
                if (!role) {
                    return res.status(404).json({ message: 'role not found or not updated' });
                }
                return res.status(200).json({ message: 'role updated', data: role });
            }
            catch (error) {
                console.error('Error updating role:', error);
                return res.status(500).json({ message: 'Internal server error while updating role' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const role = yield this.roleService.getById(id);
                if (!role) {
                    return res.status(404).json({ message: 'role not found', data: null });
                }
                yield this.roleService.delete(id);
                return res.status(200).json({ message: 'role deleted', data: role });
            }
            catch (error) {
                console.error('Error deleting role:', error);
                return res.status(500).json({ message: 'Internal server error while deleting role' });
            }
        });
    }
}
exports.RoleController = RoleController;
