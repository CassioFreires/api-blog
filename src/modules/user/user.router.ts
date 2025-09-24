import { Router, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "../../middlewares/authRole.middleware";
import { upload } from "../../middlewares/upload.middleware";

const authMiddleware = new AuthMiddleware()

const userRouters = Router();

const userService = new UserService()
const userController = new UserController(userService)

userRouters.post('/',
    ((req: Request, res: Response) => { userController.create(req, res) })
);

userRouters.post('/add-friends',
    authMiddleware.auth,
    (req: Request, res: Response) => userController.addFriends(req, res)
);


userRouters.get('/',
    ((req: Request, res: Response) => { userController.getAll(req, res) })
);
userRouters.get('/friendship-sugestion',
    authMiddleware.auth,
    (req: Request, res: Response) => { userController.getFriendshipSuggestions(req, res) }
)
userRouters.get('/accepted-friends',
    authMiddleware.auth,
    (req: Request, res: Response) => { userController.getAcceptedFriends(req, res) }
);

userRouters.get('/:id',
    ((req: Request, res: Response) => { userController.getById(req, res) })
);

userRouters.patch('/:id',
    authMiddleware.auth,
    upload.single('avatar'),
    ((req: Request, res: Response) => { userController.update(req, res) })
);

userRouters.delete('/:id',
    ((req: Request, res: Response) => { userController.delete(req, res) })
);




export default userRouters;
