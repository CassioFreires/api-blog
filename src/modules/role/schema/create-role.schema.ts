import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, {message: 'O nome é obrigatório'}),
  description: z.string().min(1, {message: 'A descrição é obrigatório'}),
});

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;