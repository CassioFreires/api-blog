"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation2FAverifySchema = void 0;
const zod_1 = require("zod");
exports.validation2FAverifySchema = zod_1.z.object({
    userId: zod_1.z.number({
        required_error: "O ID do usuário é obrigatório",
        invalid_type_error: "O ID do usuário deve ser um número"
    }).positive("O ID do usuário deve ser um número positivo"),
    token: zod_1.z.string({
        required_error: "O token é obrigatório",
        invalid_type_error: "O token deve ser uma string"
    }).regex(/^\d{6}$/, "O token deve conter exatamente 6 dígitos numéricos"),
});
