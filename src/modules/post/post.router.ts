// postRouters.ts
// Sem alterações significativas no código, apenas a ordem e uma correção na rota.
// A rota `get('/top')` estava duplicada.
// Além disso, a sintaxe da rota 'post/' foi corrigida para usar o middleware de forma encadeada.

import { Router, Request, Response, NextFunction } from "express";
import PostController from "./post.controller";
import PostService from "./post.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/authRole.middleware";
import { validateIdParam } from "../../middlewares/validateIdParam";
import { upload } from "../../middlewares/upload.middleware";


const postRouters = Router();

const authMiddleware = new AuthMiddleware()
const userController = new PostController()

// CORREÇÃO: Middleware encadeado de forma correta
postRouters.post('/',
    authMiddleware.auth,
    checkRole(['admin']),
    (req: Request, res: Response) => { userController.create(req, res) }
);

postRouters.post('/createpostbyuser',
    authMiddleware.auth,
    upload.single('postImage'),
    (req: Request, res: Response) => { userController.createPostByUser(req, res) }
)

// A rota '/top' estava duplicada. Uma delas foi removida.
postRouters.get('/',
    ((req: Request, res: Response) => { userController.getAll(req, res) })
);
postRouters.get('/top',
    ((req: Request, res: Response) => { userController.getTop(req, res) })
);

postRouters.get('/allpostsbyuser',
    authMiddleware.auth,
    (req: Request, res: Response) => { userController.allPostsByUser(req, res) },
)

postRouters.patch('/updatepostbyuser/:id',
    authMiddleware.auth,
    upload.single('postImage'),
    (req: Request, res: Response) => { userController.updatePostByUser(req, res) }
)
postRouters.get('/:id',
    validateIdParam('id'),
    ((req: Request, res: Response) => { userController.getById(req, res) })
);

postRouters.get('/bycategories/:slug',
    (req, res) => {
        userController.getAllPostsByCategory(req, res);
    });

postRouters.get('/by-user/:id',
    authMiddleware.auth,
    (req, res) => {userController.getPostsByUser(req, res)

    });

postRouters.patch('/:id',
    validateIdParam('id'),
    ((req: Request, res: Response) => { userController.update(req, res) })
);
postRouters.delete('/:id',
    validateIdParam('id'),
    ((req: Request, res: Response) => { userController.delete(req, res) })
);

postRouters.delete('/deletepostbyuser/:id',
    validateIdParam('id'),
    authMiddleware.auth,
    ((req: Request, res: Response) => { userController.deletePostByUser(req, res) })
);

export default postRouters;