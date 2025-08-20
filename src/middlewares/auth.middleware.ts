import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default class AuthMiddleware {
    auth = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: "Token não fornecido" });
            return
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Não autorizado" });
            return
        }

        try {
            const secretAccessToken = process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY;
            if (!secretAccessToken) {
                res.status(500).json({ message: "Chave JWT não configurada" });
                return
            }

            const decoded = jwt.verify(token, secretAccessToken);
            req.user = decoded as any;
            next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ message: "Token expirado", expiredAt: error.expiredAt });
                return
            }
            res.status(401).json({ message: "Token inválido" });
            return
        }
    };
}
