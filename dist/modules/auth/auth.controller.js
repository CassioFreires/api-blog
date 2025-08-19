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
const validation_signup_schema_1 = require("./schema/validation-signup.schema");
const validation_2faGenerate_schema_1 = require("./schema/validation-2faGenerate.schema");
const validation_2faVerify_schema_1 = require("./schema/validation-2faVerify.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupAuthDto = req.body.data;
                const validation = validation_signup_schema_1.validationSignupSchema.safeParse(signupAuthDto);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Validation failed',
                        error: validation.error.flatten().fieldErrors
                    });
                }
                const user = yield this.authService.signup(signupAuthDto);
                return res.status(201).json({ message: 'Usuario registrado!', user });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar registrar usuário!'
                });
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.signin(req.body);
                // Verificações específicas por mensagem de erro
                if ((result === null || result === void 0 ? void 0 : result.message) === 'Usuário não encontrado') {
                    return res.status(404).json({ message: 'Usuário não encontrado' });
                }
                if ((result === null || result === void 0 ? void 0 : result.message) === 'Senha inválida') {
                    return res.status(401).json({ message: 'Senha inválida' });
                }
                const privateKey = String(process.env.JWT_PRIVATE_ACCESS_TOKEN_KEY);
                const token = jsonwebtoken_1.default.sign(result, privateKey, { expiresIn: '1d' });
                // Sucesso: retorna token e usuário
                return res.status(200).json({
                    token,
                    result
                });
            }
            catch (error) {
                console.error('[ERRO - SIGNIN]', error);
                // Verifica se o erro tem uma mensagem específica
                const message = (error === null || error === void 0 ? void 0 : error.message) || 'Erro interno do servidor';
                return res.status(500).json({ message });
            }
        });
    }
    generate2FA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                const validation = validation_2faGenerate_schema_1.validation2FAGenerationSchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'O ID do usuário é obrigatório'
                    });
                }
                const result = yield this.authService.generate2FA(userId);
                return res.json({ message: '2FA gerado com sucesso', result });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    verify2FA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, token } = req.body;
                const validation = validation_2faVerify_schema_1.validation2FAverifySchema.safeParse(req.body);
                if (!validation.success) {
                    return res.status(400).json({
                        message: "Validation failed",
                        error: validation.error.flatten().fieldErrors
                    });
                }
                const result = yield this.authService.verify2FA(userId, token);
                if (!result.user) {
                    return res.status(400).json({
                        result
                    });
                }
                return res.json({
                    message: 'Autenticado com sucesso',
                    result
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar verificar o 2FA',
                    error
                });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId || typeof userId !== 'number') {
                    return res.status(400).json({
                        message: "O ID do usuário é obrigatório e deve ser um número válido"
                    });
                }
                const result = yield this.authService.logout(userId);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error("Erro no logout:", error);
                return res.status(500).json({
                    message: "Erro ao realizar logout",
                    error
                });
            }
        });
    }
}
exports.default = AuthController;
