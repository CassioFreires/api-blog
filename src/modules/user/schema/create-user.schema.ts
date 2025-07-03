import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório' }),
  fullName: z.string().min(1, { message: 'O último nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password_hash: z.string().min(6, { message: 'Senha inváilida' }),
  role_id: z.number().int({ message: 'ID do papel deve ser um número inteiro' }).min(1, { message: 'ID do papel é obrigatório e deve ser válido' })

});

export type CreateUserDTO = z.infer<typeof createUserSchema>;