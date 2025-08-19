"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    auth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const decoded = jsonwebtoken_1.default.verify(token, secretAccessToken);
                req.user = decoded;
                next();
            }
            catch (error) {
                if (error.name === 'TokenExpiredError') {
                    console.warn("Token expirado:", error.expiredAt);
                    return res.status(401).json({ message: "Token expirado", expiredAt: error.expiredAt });
                }
                console.error("Erro ao verificar o token:", error);
                return res.status(401).json({ message: "Token inválido" });
            }
        });
    }
}
exports.default = AuthMiddleware;
