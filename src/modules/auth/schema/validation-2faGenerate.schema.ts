import z from 'zod';


export const validation2FAGenerationSchema = z.object({
  userId: z
  .number({
    required_error: "O ID do usuário é obrigatório",
    invalid_type_error: "O ID do usuário deve ser um número"
  })
  .positive("O ID do usuário deve ser um número positivo")
});
