"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleSchema = void 0;
const zod_1 = require("zod");
exports.createRoleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'O nome é obrigatório' }),
    description: zod_1.z.string().min(1, { message: 'A descrição é obrigatório' }),
});
