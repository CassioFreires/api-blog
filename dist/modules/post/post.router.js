"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = __importDefault(require("./post.controller"));
const post_service_1 = __importDefault(require("./post.service"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const authRole_middleware_1 = require("../../middlewares/authRole.middleware");
const validateIdParam_1 = require("../../middlewares/validateIdParam");
const postRouters = (0, express_1.Router)();
const authMiddleware = new auth_middleware_1.default();
const postService = new post_service_1.default();
const userController = new post_controller_1.default(postService);
postRouters.post('/', ((req, res, next) => { authMiddleware.auth(req, res, next); }), (0, authRole_middleware_1.checkRole)(['admin']), ((req, res) => { userController.create(req, res); }));
postRouters.get('/', ((req, res) => { userController.getAll(req, res); }));
postRouters.get('/top', ((req, res) => { userController.getTop(req, res); }));
postRouters.get('/top', (req, res) => {
    userController.getTop(req, res);
});
postRouters.get('/:id', (0, validateIdParam_1.validateIdParam)('id'), ((req, res) => { userController.getById(req, res); }));
postRouters.patch('/:id', (0, validateIdParam_1.validateIdParam)('id'), ((req, res) => { userController.update(req, res); }));
postRouters.delete('/:id', (0, validateIdParam_1.validateIdParam)('id'), ((req, res) => { userController.delete(req, res); }));
postRouters.get('/bycategories/:slug', (req, res) => {
    userController.getAllPostsByCategory(req, res);
});
exports.default = postRouters;
