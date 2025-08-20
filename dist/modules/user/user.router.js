"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const authMiddleware = new auth_middleware_1.default();
const userRouters = (0, express_1.Router)();
const userService = new user_service_1.UserService();
const userController = new user_controller_1.UserController(userService);
userRouters.post('/', ((req, res) => { userController.create(req, res); }));
userRouters.get('/', ((req, res) => { userController.getAll(req, res); }));
userRouters.get('/:id', ((req, res) => { userController.getById(req, res); }));
userRouters.patch('/:id', authMiddleware.auth, ((req, res) => { userController.update(req, res); }));
userRouters.delete('/:id', ((req, res) => { userController.delete(req, res); }));
exports.default = userRouters;
