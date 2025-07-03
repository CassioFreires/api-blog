"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchemaUpdatePost = void 0;
const zod_1 = __importDefault(require("zod"));
exports.validationSchemaUpdatePost = zod_1.default.object({
    title: zod_1.default.string().min(1, "Título não pode ser vazio").optional(),
    subtitle: zod_1.default.string().min(1, "Subtítulo não pode ser vazio").optional(),
    content: zod_1.default.string().min(1, "Conteúdo não pode ser vazio").optional(),
});
