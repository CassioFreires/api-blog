"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationLikeSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.validationLikeSchema = zod_1.default.object({
    user_id: zod_1.default.number().positive({ message: 'ID do usuário inválido' }),
    post_id: zod_1.default.number().positive({ message: 'ID do post inválido' }),
});
