import z from 'zod';

export const validationSchemaUpdatePost = z.object({
  title: z.string().min(1, "Título não pode ser vazio").optional(),
  subtitle: z.string().min(1, "Subtítulo não pode ser vazio").optional(),
  content: z.string().min(1, "Conteúdo não pode ser vazio").optional(),
});