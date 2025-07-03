"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const user_entities_1 = __importDefault(require("../modules/user/entities/user.entities"));
const role_entities_1 = require("../modules/role/entities/role.entities");
const permission_entitie_1 = require("../modules/permission/entities/permission.entitie");
const create_role_permission_1 = require("../modules/role_permission/entities/create-role-permission");
const post_entities_1 = require("../modules/post/entities/post.entities");
const like_entities_1 = require("../modules/like/entities/like.entities");
const comment_entities_1 = require("../modules/comment/entities/comment.entities");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // carrega as variáveis do .env
const PsDatabase = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
        user_entities_1.default,
        role_entities_1.RoleEntity,
        permission_entitie_1.PermissionEntity,
        create_role_permission_1.RolePermissionEntity,
        post_entities_1.PostEntity,
        like_entities_1.LikeEntity,
        comment_entities_1.CommentEntity
    ],
    migrations: [],
    subscribers: [],
});
exports.default = PsDatabase;
