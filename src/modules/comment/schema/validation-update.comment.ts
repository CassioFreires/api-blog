import z from 'zod';

export const validationCommentUpdateSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Content inválido' })
    .nonempty({ message: 'Content em branco' }),
});