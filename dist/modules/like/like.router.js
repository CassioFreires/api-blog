"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const like_controller_1 = __importDefault(require("./like.controller"));
const like_service_1 = __importDefault(require("./like.service"));
const likeRouters = (0, express_1.Router)();
const likeService = new like_service_1.default();
const likeController = new like_controller_1.default(likeService);
likeRouters.post('/toggle', (req, res) => { likeController.toggle(req, res); });
likeRouters.get('/count/:post_id', ((req, res) => { likeController.countByPost(req, res); }));
likeRouters.get('/', ((req, res) => { likeController.getAll(req, res); }));
likeRouters.get('/:id', ((req, res) => { likeController.getAll(req, res); }));
likeRouters.delete('/:id', ((req, res) => { likeController.delete(req, res); }));
exports.default = likeRouters;
