import { z } from 'zod';

export const createRolePermissionSchema = z.object({
  role_id: z.number().min(1, { message: 'A chave de relacionamento da tabela role_id é obrigatório' }),
  permission_id: z.union([
    z.number().min(1),
    z.array(z.number().min(1))
  ]),
});

export type CreateRoleDTO = z.infer<typeof createRolePermissionSchema>;