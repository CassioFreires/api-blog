import z from 'zod';

export const validationUpdateUser = z.object({
    name: z.string().min(1, { message: 'O nome é obrigatório' }).optional(),
    fullName: z.string().min(1, { message: 'O último nome é obrigatório' }).optional(),
    email: z.string().email({ message: 'E-mail inválido' }).optional(),
    password_hash: z.string().min(6, { message: 'Senha inváilida' }).optional()
});