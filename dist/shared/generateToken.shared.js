"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (playload) => {
    const secretAccessToken = process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY;
    const secretRefreshToken = process.env.JWT_PRIVATE_KEY_REFRESH_TOKEN;
    if (!secretAccessToken)
        throw new Error("JJWT_PRIVATE_ACCESS_TOKEN_KEY não definida no .env");
    if (!secretRefreshToken)
        throw new Error("JWT_PRIVATE_KEY_REFRESH_TOKEN não definida no .env");
    const accessToken = jsonwebtoken_1.default.sign(playload, secretAccessToken, { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign(playload, secretRefreshToken, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
