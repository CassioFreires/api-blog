import { Router, Request, Response } from 'express';
import AuthMiddleware from '../../middlewares/auth.middleware';
import FriendshipController from './friendship.controller';


const authMiddleware = new AuthMiddleware()
const friendshipController = new FriendshipController();
const friendshipRouters = Router();


// Rota para buscar os pedidos de amizade aceitos


friendshipRouters.get('/',
    authMiddleware.auth,
    (req: Request, res: Response) => { friendshipController.getAcceptFriendShip(req, res) }
)



// Rota para buscar os pedidos de amizade pendentes
friendshipRouters.get('/pending',
    authMiddleware.auth,
    (req: Request, res: Response) => { friendshipController.getPendingFriendships(req, res) }
);

friendshipRouters.get('/accepted-friends',
    authMiddleware.auth,
    (req: Request, res: Response) => { friendshipController.getAcceptedFriends(req, res) }
);

friendshipRouters.get('/friendship-sugestion',
    authMiddleware.auth,
    (req: Request, res: Response) => { friendshipController.getFriendshipSuggestions(req, res) }
)


friendshipRouters.post('/add-friends',
    authMiddleware.auth,
    (req: Request, res: Response) => friendshipController.addFriends(req, res)
);

// rota para aceitar pedido de amizade
friendshipRouters.patch('/accept/:id',
    authMiddleware.auth,
    (req: Request, res: Response) => { friendshipController.acceptFriendship(req, res) }
);

// rota para rejeitar pedido de amizade
friendshipRouters.delete('/reject/:id',
    authMiddleware.auth,
    (req: Request, res: Response) => { friendshipController.rejectFriendship(req, res) }
);


export default friendshipRouters;