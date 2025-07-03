"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationCommentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.validationCommentSchema = zod_1.default.object({
    user_id: zod_1.default.number({
        required_error: "ID do usuário é obrigatório",
        invalid_type_error: "ID do usuário deve ser um número",
    }).int().positive(),
    post_id: zod_1.default.number({
        required_error: "ID do post é obrigatório",
        invalid_type_error: "ID do post deve ser um número",
    }).int().positive(),
    content: zod_1.default.string({
        required_error: "Comentário é obrigatório",
        invalid_type_error: "Comentário deve ser um texto",
    }).min(1, "Comentário não pode estar vazio").max(1000, "Comentário muito longo"),
});
