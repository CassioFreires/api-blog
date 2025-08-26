import { Router, Request, Response, NextFunction } from "express";
import CategoryController from "./categories.controller";
import { CategoryService } from "./categories.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/authRole.middleware";


const categoryRouters = Router();

const authMiddleware = new AuthMiddleware()
const postService = new CategoryService()
const userController = new CategoryController(postService)

categoryRouters.post('/',
    ((req: Request, res: Response, next: NextFunction) => { authMiddleware.auth(req, res, next) }),
    authMiddleware.auth,
    checkRole(['admin']),
    ((req: Request, res: Response) => { userController.create(req, res) })
);
categoryRouters.get('/',
    ((req: Request, res: Response) => { userController.getAll(req, res) })
);
categoryRouters.get('/:id',
    ((req: Request, res: Response) => { userController.getById(req, res) })
);
categoryRouters.patch('/:id',
    authMiddleware.auth,
    checkRole(['admin']),
    ((req: Request, res: Response) => { userController.update(req, res) })
);
categoryRouters.delete('/:id',
    authMiddleware.auth,
    checkRole(['admin']),
    ((req: Request, res: Response) => { userController.delete(req, res) })
);

export default categoryRouters;
