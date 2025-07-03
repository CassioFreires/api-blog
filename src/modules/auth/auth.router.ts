import { Router, Request, Response, NextFunction } from "express";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import AuthMiddleware from "../../middlewares/auth.middleware";
import { checkRole } from "src/middlewares/authRole.middleware";

const authRouters = Router();

const authService = new AuthService()
const authMiddleware = new AuthMiddleware();
const authController = new AuthController(authService)

authRouters.post('/signup',
    ((req: Request, res: Response) => { authController.signup(req, res) })
);

authRouters.post('/signin',
    ((req: Request, res: Response) => { authController.signin(req, res) })
);

authRouters.post('/2fa/generate',
    ((req: Request, res: Response) => { authController.generate2FA(req, res) })
);

authRouters.post('/2fa/verify',
    ((req: Request, res: Response) => { authController.verify2FA(req, res) })
);

authRouters.post('/logout',
    ((req: Request, res: Response) => { authController.verify2FA(req, res) })
);

// authRouters.get('/:id',
//     ((req: Request, res: Response) => { authController.getById(req, res) })
// );
// authRouters.patch('/:id',
//     ((req: Request, res: Response) => { authController.update(req, res) })
// );
// authRouters.delete('/:id',
//     ((req: Request, res: Response) => { authController.delete(req, res) })
// );

export default authRouters;
