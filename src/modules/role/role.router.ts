import { Router, Request, Response } from "express";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

const roleRouters = Router();

const roleService = new RoleService()
const roleController = new RoleController(roleService)

roleRouters.post('/',
    ((req: Request, res: Response) => { roleController.create(req, res) })
);
roleRouters.get('/',
    ((req: Request, res: Response) => { roleController.getAll(req, res) })
);
roleRouters.get('/:id',
    ((req: Request, res: Response) => { roleController.getById(req, res) })
);
roleRouters.patch('/:id',
    ((req: Request, res: Response) => { roleController.update(req, res) })
);
roleRouters.delete('/:id',
    ((req: Request, res: Response) => { roleController.delete(req, res) })
);

export default roleRouters;
