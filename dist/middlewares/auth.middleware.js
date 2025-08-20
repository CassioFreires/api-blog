"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    constructor() {
        this.auth = (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ message: "Token não fornecido" });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Não autorizado" });
                return;
            }
            try {
                const secretAccessToken = process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY;
                if (!secretAccessToken) {
                    res.status(500).json({ message: "Chave JWT não configurada" });
                    return;
                }
                const decoded = jsonwebtoken_1.default.verify(token, secretAccessToken);
                req.user = decoded;
                next();
            }
            catch (error) {
                if (error.name === "TokenExpiredError") {
                    res.status(401).json({ message: "Token expirado", expiredAt: error.expiredAt });
                    return;
                }
                res.status(401).json({ message: "Token inválido" });
                return;
            }
        };
    }
}
exports.default = AuthMiddleware;
