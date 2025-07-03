import { z } from 'zod';

export const createPermissionSchema = z.object({
  name: z.string().min(1, {message: 'O nome é obrigatório'}),
  description: z.string().min(1, {message: 'A descrição é obrigatório'}),
});

export type CreateRoleDTO = z.infer<typeof createPermissionSchema>;