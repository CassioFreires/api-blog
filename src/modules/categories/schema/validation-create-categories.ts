import z from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome inválido' })
    .nonempty({ message: 'Nome da categoria não pode estar em branco' }),

  slug: z
    .string()
    .min(3, { message: 'Slug inválido' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug deve conter apenas letras minúsculas, números e hifens',
    })
    .nonempty({ message: 'Slug da categoria não pode estar em branco' }),
});
