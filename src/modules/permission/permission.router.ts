import { Router, Request, Response } from "express";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";

const permissionRouters = Router();

const permissioService = new PermissionService();
const permissionController = new PermissionController(permissioService);

permissionRouters.post('/',
    ((req: Request, res: Response) => { permissionController.create(req, res) })
);
permissionRouters.get('/',
    ((req: Request, res: Response) => { permissionController.getAll(req, res) })
);
permissionRouters.get('/:id',
    ((req: Request, res: Response) => { permissionController.getById(req, res) })
);
permissionRouters.get('/find-many',
    ((req: Request, res: Response) => { permissionController.getByIds(req, res) })
);
permissionRouters.patch('/:id',
    ((req: Request, res: Response) => { permissionController.update(req, res) })
);
permissionRouters.delete('/:id',
    ((req: Request, res: Response) => { permissionController.delete(req, res) })
);

export default permissionRouters;
