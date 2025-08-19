import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";


export default class AuthMiddleware {
    async auth(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        const token = authHeader.split(" ")[1];
        if (!token || token.length <= 0) {
            return res.status(401).json({ message: "Não autorizado" });
        }

        try {
            const secretAccessToken = process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY;
            if (!secretAccessToken) {
                return res.status(500).json({ message: "Chave JWT não configurada" });
            }

            const decoded = jwt.verify(token, secretAccessToken);
            req.user = decoded as any;
            next();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                console.warn("Token expirado:", error.expiredAt);
                return res.status(401).json({ message: "Token expirado", expiredAt: error.expiredAt });
            }

            console.error("Erro ao verificar o token:", error);
            return res.status(401).json({ message: "Token inválido" });
        }
    }
}
