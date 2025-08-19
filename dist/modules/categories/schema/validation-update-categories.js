"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateCategorySchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(3, { message: 'Nome inválido' })
        .nonempty({ message: 'Nome da categoria não pode estar em branco' })
        .optional(),
    slug: zod_1.default
        .string()
        .min(3, { message: 'Slug inválido' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug deve conter apenas letras minúsculas, números e hifens',
    })
        .nonempty({ message: 'Slug da categoria não pode estar em branco' })
        .optional(),
});
