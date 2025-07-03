import z from 'zod';

export const validationLikeSchema = z.object({
    user_id: z.number().positive({ message: 'ID do usuário inválido' }),
    post_id: z.number().positive({ message: 'ID do post inválido' }),
})