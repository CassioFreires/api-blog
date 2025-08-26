import z from 'zod';

export const validationCommentUpdateSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Content inválido' })
    .nonempty({ message: 'Content em branco' }),
});