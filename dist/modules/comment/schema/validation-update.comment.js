"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationCommentUpdateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.validationCommentUpdateSchema = zod_1.default.object({
    content: zod_1.default
        .string()
        .min(10, { message: 'Content inválido' })
        .nonempty({ message: 'Content em branco' }),
});
