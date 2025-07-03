import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserEntity from '../modules/user/entities/user.entities';
import { RoleEntity } from '../modules/role/entities/role.entities';
import { PermissionEntity } from '../modules/permission/entities/permission.entitie';
import { RolePermissionEntity } from '../modules/role_permission/entities/create-role-permission';
import { PostEntity } from '../modules/post/entities/post.entities';
import { LikeEntity } from '../modules/like/entities/like.entities';
import { CommentEntity } from '../modules/comment/entities/comment.entities';
import dotenv from 'dotenv';
dotenv.config(); // carrega as variáveis do .env


const PsDatabase = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
        UserEntity,
        RoleEntity,
        PermissionEntity,
        RolePermissionEntity,
        PostEntity,
        LikeEntity,
        CommentEntity
    ],
    migrations: [],
    subscribers: [],
});

export default PsDatabase;