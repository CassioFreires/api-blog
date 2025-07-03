"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const authRouters = (0, express_1.Router)();
const authService = new auth_service_1.default();
const authMiddleware = new auth_middleware_1.default();
const authController = new auth_controller_1.default(authService);
authRouters.post('/signup', ((req, res) => { authController.signup(req, res); }));
authRouters.post('/signin', ((req, res) => { authController.signin(req, res); }));
authRouters.post('/2fa/generate', ((req, res) => { authController.generate2FA(req, res); }));
authRouters.post('/2fa/verify', ((req, res) => { authController.verify2FA(req, res); }));
authRouters.post('/logout', ((req, res) => { authController.verify2FA(req, res); }));
// authRouters.get('/:id',
//     ((req: Request, res: Response) => { authController.getById(req, res) })
// );
// authRouters.patch('/:id',
//     ((req: Request, res: Response) => { authController.update(req, res) })
// );
// authRouters.delete('/:id',
//     ((req: Request, res: Response) => { authController.delete(req, res) })
// );
exports.default = authRouters;
