"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation2FAGenerationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.validation2FAGenerationSchema = zod_1.default.object({
    userId: zod_1.default
        .number({
        required_error: "O ID do usuário é obrigatório",
        invalid_type_error: "O ID do usuário deve ser um número"
    })
        .positive("O ID do usuário deve ser um número positivo")
});
