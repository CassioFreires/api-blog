"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const hashPassword_1 = require("../../shared/hashPassword");
const auth_repository_1 = __importDefault(require("./auth.repository"));
const hashPassword_2 = require("../../shared/hashPassword");
const speakeasy = __importStar(require("speakeasy"));
const qrcode = __importStar(require("qrcode"));
const generateToken_shared_1 = require("../../shared/generateToken.shared");
const role_repository_1 = require("../role/role.repository");
class AuthService {
    constructor() {
        this.userRepository = new auth_repository_1.default();
        this.RoleRepository = new role_repository_1.RoleRepository();
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userExist = yield this.userRepository.getByEmail(data.email);
                const roleExist = yield this.RoleRepository.getByName('usuário comum');
                if (userExist)
                    return { message: "Email já está em uso" };
                if (!roleExist)
                    return { message: "Role padrão não existe para aplicar ao usuário comum!" };
                const password_hash = yield (0, hashPassword_1.hashPassword)(data.password_hash);
                const newData = {
                    name: data.name.toLocaleLowerCase(),
                    lastName: data.lastName.toLocaleLowerCase(),
                    email: data.email.toLocaleLowerCase(),
                    password_hash: password_hash,
                    bio: (_a = data === null || data === void 0 ? void 0 : data.bio) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase(),
                    avatarUrl: data === null || data === void 0 ? void 0 : data.avatarUrl,
                    role_id: roleExist.id
                };
                const createUser = yield this.userRepository.signup(newData);
                return { message: "Usuário criado com sucesso", user: createUser };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    signin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = {
                    email: data.email.toLocaleLowerCase(),
                    password_hash: data.password_hash
                };
                const user = yield this.userRepository.findByEmailWithPassword(newData.email);
                if (!user)
                    return { message: 'Usuário não encontrado' };
                const isPasswordValid = yield (0, hashPassword_2.comparePassword)(newData.password_hash, user.password_hash);
                if (!isPasswordValid) {
                    return { message: 'Senha inválida', isPasswordValid };
                }
                if (user.isTwoFactorEnabled) {
                    // Aqui você pode decidir se vai exigir token 2FA agora ou em outra etapa
                    return {
                        message: "2FA obrigatório",
                        userId: user.id,
                        twoFactorEnabled: true
                    };
                }
                return {
                    message: 'Usuário autenticado',
                    user: {
                        id: user.id,
                        name: user.name,
                        fullName: user.fullName || user.lastName, // se fullName existir no banco
                        email: user.email,
                        bio: user.bio,
                        avatarUrl: user.avatarUrl, // corrigido o typo
                        isTwoFactorEnabled: user.isTwoFactorEnabled,
                        role_id: user.role_id,
                        role_name: user.role_name,
                        role_description: user.role_description
                    }
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    generate2FA(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                return {
                    message: 'Usuário não encontrado'
                };
            }
            if (user.isTwoFactorEnabled && user.twoFactorSecret) {
                return { message: '2FA já ativado para este usuário' };
            }
            const secret = speakeasy.generateSecret({
                name: `BlogApp ${user.email}`
            });
            yield this.userRepository.updateTwoFactorSecret(userId, secret.base32);
            const qrCode = yield qrcode.toDataURL(secret.otpauth_url || '');
            return {
                message: '2FA Gerado',
                secret: secret.base32,
                qrCode
            };
        });
    }
    verify2FA(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findById(userId);
                if (!user || !user.twoFactorSecret) {
                    return {
                        message: 'Usuário sem 2FA configurado',
                        user
                    };
                }
                const verified = speakeasy.totp.verify({
                    secret: user === null || user === void 0 ? void 0 : user.twoFactorSecret,
                    encoding: 'base32',
                    token
                });
                if (!verified)
                    return { message: 'Token 2FA inválido' };
                // Se 2FA não ativado, autentica direto
                // Gera token JWT ou sessão aqui, por exemplo:
                const newUser = {
                    id: user.id,
                    name: user.name,
                    fullName: user.lastName,
                    role: user.role
                };
                const jwtToken = (0, generateToken_shared_1.generateToken)(newUser); // Implemente a função generateJWT conforme seu contexto
                yield this.userRepository.updateRefreshToken(user.id, jwtToken.refreshToken);
                return {
                    message: '2FA verificado com sucesso',
                    user,
                    accessToken: jwtToken.accessToken,
                    refreshToken: jwtToken.refreshToken
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || isNaN(userId)) {
                throw new Error("ID do usuário inválido.");
            }
            try {
                yield this.userRepository.clearRefreshToken(userId);
                return { message: "Logout realizado com sucesso" };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = AuthService;
