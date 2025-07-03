"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.creatPostSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .min(5, { message: 'Texto inválido' })
        .nonempty({ message: 'Texto em branco' }),
    subtitle: zod_1.default
        .string()
        .min(5, { message: 'Subtitle inválido' })
        .nonempty({ message: 'Subtitle em branco' }),
    content: zod_1.default
        .string()
        .min(10, { message: 'Content inválido' })
        .nonempty({ message: 'Content em branco' }),
    user_id: zod_1.default
        .number({ invalid_type_error: 'ID do usuário deve ser numérico' })
        .int({ message: 'ID do usuário inválido' })
});
