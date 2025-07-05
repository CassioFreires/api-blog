"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'O nome é obrigatório' }),
    fullName: zod_1.z.string().min(1, { message: 'O último nome é obrigatório' }),
    email: zod_1.z.string().email({ message: 'E-mail inválido' }),
    password_hash: zod_1.z.string().min(6, { message: 'Senha inváilida' }),
    role_id: zod_1.z.number().int({ message: 'ID do papel deve ser um número inteiro' }).min(1, { message: 'ID do papel é obrigatório e deve ser válido' }).optional()
});
