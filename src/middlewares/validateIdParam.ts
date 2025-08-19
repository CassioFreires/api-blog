import { Request, Response, NextFunction } from "express";

export function validateIdParam(paramName: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const value = req.params[paramName];

        if (!value || isNaN(Number(value))) {
            res.status(400).json({
                message: `Parâmetro '${paramName}' inválido ou ausente.`
            });
            return; // só retorna para sair da função, sem retornar o Response
        }

        // opcional: converte para número e sobrescreve no params
        req.params[paramName] = Number(value).toString();

        next(); // segue para o próximo middleware/controller
    };
}