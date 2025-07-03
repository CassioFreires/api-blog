import { z } from 'zod';

export const validation2FAverifySchema = z.object({
  userId: z.number({
    required_error: "O ID do usuário é obrigatório",
    invalid_type_error: "O ID do usuário deve ser um número"
  }).positive("O ID do usuário deve ser um número positivo"),

  token: z.string({
    required_error: "O token é obrigatório",
    invalid_type_error: "O token deve ser uma string"
  }).regex(/^\d{6}$/, "O token deve conter exatamente 6 dígitos numéricos"),
});
