import { Router, Request, Response } from "express";
import { RolePermissionController } from "./role-permission.controller";
import { RolePermissionService } from "./role-permission.service";

const rolePermissionRouters = Router();

const userService = new RolePermissionService()
const rolePermissionController = new RolePermissionController(userService)

rolePermissionRouters.post('/',
    ((req: Request, res: Response) => { rolePermissionController.create(req, res) })
);
rolePermissionRouters.get('/',
    ((req: Request, res: Response) => { rolePermissionController.getAll(req, res) })
);
rolePermissionRouters.get('/:id',
    ((req: Request, res: Response) => { rolePermissionController.getById(req, res) })
);
rolePermissionRouters.patch('/:id',
    ((req: Request, res: Response) => { rolePermissionController.update(req, res) })
);
rolePermissionRouters.delete('/:id',
    ((req: Request, res: Response) => { rolePermissionController.delete(req, res) })
);

export default rolePermissionRouters;
