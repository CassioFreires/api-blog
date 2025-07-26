import { Router, Request, Response, NextFunction} from "express";
import PostController from "./post.controller";
import PostService from "./post.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/authRole.middleware";


const postRouters = Router();

const authMiddleware = new AuthMiddleware()
const postService = new PostService()
const userController = new PostController(postService)

postRouters.post('/',
    ((req:Request, res:Response, next:NextFunction) => {authMiddleware.auth(req, res, next)}),
    checkRole(['usuário comum']),
    ((req: Request, res: Response) => { userController.create(req, res) })
);
postRouters.get('/',
    ((req: Request, res: Response) => { userController.getAll(req, res) })
);
postRouters.get('/top',
    ((req: Request, res: Response) => { userController.getTop(req, res) })
);
postRouters.get('/:id',
    ((req: Request, res: Response) => { userController.getById(req, res) })
);
postRouters.patch('/:id',
    ((req: Request, res: Response) => { userController.update(req, res) })
);  
postRouters.delete('/:id',
    ((req: Request, res: Response) => { userController.delete(req, res) })
);

export default postRouters;
