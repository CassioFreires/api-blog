import z from 'zod';

export const creatPostSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Texto inválido' })
    .nonempty({ message: 'Texto em branco' }),

  subtitle: z
    .string()
    .min(5, { message: 'Subtitle inválido' })
    .nonempty({ message: 'Subtitle em branco' }),

  content: z
    .string()
    .min(10, { message: 'Content inválido' })
    .nonempty({ message: 'Content em branco' }),

  user_id: z
    .number({ invalid_type_error: 'ID do usuário deve ser numérico' })
    .int({ message: 'ID do usuário inválido' })
});
