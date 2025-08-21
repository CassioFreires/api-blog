import { Router, Request, Response, NextFunction } from "express";
import PostController from "./post.controller";
import PostService from "./post.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/authRole.middleware";
import { validateIdParam } from "../../middlewares/validateIdParam";


const postRouters = Router();

const authMiddleware = new AuthMiddleware()
const userController = new PostController()

postRouters.post('/',
    ((req: Request, res: Response, next: NextFunction) => {
        authMiddleware.auth
    }),
    checkRole(['admin']),
    ((req: Request, res: Response) => { userController.create(req, res) })
);

postRouters.post('/createpostbyuser', 
    authMiddleware.auth,
    (req:Request, res:Response) => {userController.createPostByUser(req, res)}
)
   

postRouters.get('/',
    ((req: Request, res: Response) => { userController.getAll(req, res) })
);
postRouters.get('/top',
    ((req: Request, res: Response) => { userController.getTop(req, res) })
);
postRouters.get('/top', (req: Request, res: Response) => {
    userController.getTop(req, res);
});

postRouters.get('/allpostsbyuser',
    authMiddleware.auth,
    (req: Request, res: Response) => { userController.allPostsByUser(req, res) },
)

postRouters.patch('/updatepostbyuser',
    authMiddleware.auth,
    (req: Request, res: Response) => { userController.updatePostByUser(req, res)}
)
postRouters.get('/:id',
    validateIdParam('id'),
    ((req: Request, res: Response) => { userController.getById(req, res) })
);

postRouters.get('/bycategories/:slug',
    (req, res) => {
        userController.getAllPostsByCategory(req, res);
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
