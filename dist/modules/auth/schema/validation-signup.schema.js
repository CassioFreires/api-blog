"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSignupSchema = void 0;
const create_user_schema_1 = require("../../../modules/user/schema/create-user.schema");
const zod_1 = __importDefault(require("zod"));
exports.validationSignupSchema = create_user_schema_1.createUserSchema.extend({
    confirmPassword: zod_1.default.string().min(6)
}).refine((data) => data.password_hash == data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
});
