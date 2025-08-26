import { Router, Request, Response } from "express";
import CommentController from "./comment.controller";
import CommentService from "./comment.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/authRole.middleware";
import { validateIdParam } from "../../middlewares/validateIdParam";

const commentRouters = Router();

const authMiddleware = new AuthMiddleware();
const commentService = new CommentService()
const commentController = new CommentController(commentService)

commentRouters.post('/',
    authMiddleware.auth,
    (req: Request, res: Response) => {commentController.create(req, res)}
);

commentRouters.get('/post/:post_id',
    ((req: Request, res: Response) => { commentController.getAllCommentByPost(req, res) })
);
commentRouters.get('/',
    ((req: Request, res: Response) => { commentController.getAll(req, res) })
);
commentRouters.get('/:id',
    ((req: Request, res: Response) => { commentController.getById(req, res) })
);

commentRouters.patch('/:id',
    validateIdParam('id'),
    authMiddleware.auth,
    ((req: Request, res: Response) => { commentController.update(req, res) })
);
 
commentRouters.delete('/:id',
    validateIdParam('id'),
    authMiddleware.auth,
    ((req: Request, res: Response) => { commentController.delete(req, res) })
);

export default commentRouters;
