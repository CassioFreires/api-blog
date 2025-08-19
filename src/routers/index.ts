import express from 'express';
import userRouters from '../modules/user/user.router';
import roleRouters from '../modules/role/role.router';
import permissionRouters from '../modules/permission/permission.router';
import rolePermissionRouters from '../modules/role_permission/role-permission.router';
import postRouters from '../modules/post/post.router';
import likeRouters from '../modules/like/like.router';
import commentRouters from '../modules/comment/comment.router';
import authRouters from '../modules/auth/auth.router';
import categoryRouters from '../modules/categories/categories.router';

const routers = express.Router();

routers.use('/users', userRouters);
routers.use('/roles', roleRouters);
routers.use('/permissions', permissionRouters);
routers.use('/role_permission', rolePermissionRouters);
routers.use('/posts', postRouters);
routers.use('/likes', likeRouters);
routers.use('/comments', commentRouters);
routers.use('/auth', authRouters);
routers.use('/categories', categoryRouters);
    

export default routers;