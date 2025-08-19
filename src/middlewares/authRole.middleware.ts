import { NextFunction, Request, Response, RequestHandler } from "express";

export function checkRole(allowedRoles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as any; // ideal tipar corretamente se tiver `JwtUserPayload`

    console.log()
    if (!user || !user.user.role || !allowedRoles.includes(user.user.role.role_name)) {
      res.status(403).json({ message: "Permissão insuficiente" });
      return; // isso evita seguir com next() em caso de erro
    }

    next(); // segue se passar na validação
  };
}
