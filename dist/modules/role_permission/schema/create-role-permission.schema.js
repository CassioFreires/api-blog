"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRolePermissionSchema = void 0;
const zod_1 = require("zod");
exports.createRolePermissionSchema = zod_1.z.object({
    role_id: zod_1.z.number().min(1, { message: 'A chave de relacionamento da tabela role_id é obrigatório' }),
    permission_id: zod_1.z.union([
        zod_1.z.number().min(1),
        zod_1.z.array(zod_1.z.number().min(1))
    ]),
});
