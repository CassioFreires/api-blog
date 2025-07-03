"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = __importDefault(require("./comment.controller"));
const comment_service_1 = __importDefault(require("./comment.service"));
const commentRouters = (0, express_1.Router)();
const commentService = new comment_service_1.default();
const commentController = new comment_controller_1.default(commentService);
commentRouters.post('/', (req, res) => { commentController.create(req, res); });
commentRouters.get('/post/:post_id', ((req, res) => { commentController.getAllCommentByPost(req, res); }));
commentRouters.get('/', ((req, res) => { commentController.getAll(req, res); }));
commentRouters.get('/:id', ((req, res) => { commentController.getById(req, res); }));
commentRouters.patch('/:id', ((req, res) => { commentController.update(req, res); }));
commentRouters.delete('/:id', ((req, res) => { commentController.delete(req, res); }));
exports.default = commentRouters;
