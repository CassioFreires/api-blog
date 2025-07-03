import z from 'zod';

export const validationCommentSchema = z.object({
  user_id: z.number({
    required_error: "ID do usuário é obrigatório",
    invalid_type_error: "ID do usuário deve ser um número",
  }).int().positive(),

  post_id: z.number({
    required_error: "ID do post é obrigatório",
    invalid_type_error: "ID do post deve ser um número",
  }).int().positive(),

  content: z.string({
    required_error: "Comentário é obrigatório",
    invalid_type_error: "Comentário deve ser um texto",
  }).min(1, "Comentário não pode estar vazio").max(1000, "Comentário muito longo"),
});
