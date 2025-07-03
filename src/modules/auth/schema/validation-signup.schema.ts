import { createUserSchema } from "../../../modules/user/schema/create-user.schema";
import z from 'zod';

export const validationSignupSchema = createUserSchema.extend({
    confirmPassword: z.string().min(6)
}).refine((data) => data.password_hash == data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword']
});

