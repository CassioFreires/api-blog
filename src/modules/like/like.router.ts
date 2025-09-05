import { Router, Request, Response } from "express";
import LikeController from "./like.controller";
import LikeService from "./like.service";
import AuthMiddleware from "../../middlewares/auth.middleware";

const likeRouters = Router();

const likeService = new LikeService()
const likeController = new LikeController(likeService);
const authMiddleware = new AuthMiddleware();

likeRouters.post('/toggle',
    authMiddleware.auth,
    (req: Request, res: Response) => {likeController.toggle(req, res)}
);
likeRouters.post('/count-multiple',
  ((req: Request, res: Response) => { likeController.countByMultiplePosts(req, res) })
);
likeRouters.get('/count/:post_id',
    ((req: Request, res: Response) => { likeController.countByPost(req, res) })
);

likeRouters.get('/liked-by-user/:postId/:userId',
    authMiddleware.auth,
    ((req: Request, res:Response) => {likeController.getUserLiked(req, res)})
)
likeRouters.get('/',
    ((req: Request, res: Response) => { likeController.getAll(req, res) })
);
likeRouters.get('/:id',
    ((req: Request, res: Response) => { likeController.getAll(req, res) })
);
 

likeRouters.delete('/:id',
    ((req: Request, res: Response) => { likeController.delete(req, res) })
);

export default likeRouters;
