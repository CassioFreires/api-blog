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
exports.UserController = void 0;
const update_user_schema_1 = require("./schema/update-user.schema");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const resultUser = yield this.userService.getByEmail(data.email);
                if (resultUser) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
                const validation = update_user_schema_1.validationUpdateUser.safeParse(data);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        errors: validation.error.flatten().fieldErrors,
                    });
                }
                const user = yield this.userService.create(data);
                return res.status(201).json({ message: 'User created', data: user });
            }
            catch (error) {
                console.error('Error creating user:', error);
                // Tratamento específico para erro de e-mail duplicado (fallback caso falhe o getByEmail)
                if (error.code === '23505') {
                    return res.status(409).json({ message: 'E-mail already registered' });
                }
                return res.status(500).json({
                    message: 'Internal server error while creating user'
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAll();
                if (!users || users.length === 0) {
                    return res.status(404).json({ message: 'No users found' });
                }
                return res.status(200).json({ message: 'Users fetched', data: users });
            }
            catch (error) {
                console.error('Error fetching users:', error);
                return res.status(500).json({ message: 'Internal server error while fetching users' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const user = yield this.userService.getById(id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json({ message: 'User fetched', data: user });
            }
            catch (error) {
                console.error('Error fetching user by ID:', error);
                return res.status(500).json({ message: 'Internal server error while fetching user by ID' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const userIdFromToken = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.user.id);
                const idToUpdate = Number(req.params.id);
                if (userIdFromToken !== idToUpdate) {
                    return res.status(403).json({ message: "Acesso negado" });
                }
                const user = yield this.userService.update(id, data);
                if (!user) {
                    return res.status(404).json({ message: "User not found or not updated" });
                }
                console.log(user);
                // ✅ Retorna só o usuário atualizado
                return res.status(200).json(user);
            }
            catch (error) {
                console.error("Error updating user:", error);
                return res
                    .status(500)
                    .json({ message: "Internal server error while updating user" });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const user = yield this.userService.getById(id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found', data: null });
                }
                yield this.userService.delete(id);
                return res.status(200).json({ message: 'User deleted', data: user });
            }
            catch (error) {
                console.error('Error deleting user:', error);
                return res.status(500).json({ message: 'Internal server error while deleting user' });
            }
        });
    }
}
exports.UserController = UserController;
