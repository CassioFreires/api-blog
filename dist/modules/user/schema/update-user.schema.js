"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationUpdateUser = void 0;
const zod_1 = __importDefault(require("zod"));
exports.validationUpdateUser = zod_1.default.object({
    name: zod_1.default.string().min(1, { message: 'O nome é obrigatório' }).optional(),
    fullName: zod_1.default.string().min(1, { message: 'O último nome é obrigatório' }).optional(),
    email: zod_1.default.string().email({ message: 'E-mail inválido' }).optional(),
    password_hash: zod_1.default.string().min(6, { message: 'Senha inváilida' }).optional()
});
