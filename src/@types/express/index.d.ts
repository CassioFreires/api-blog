// types/express.d.ts ou src/@types/express/index.d.ts
import { RoleEntity } from "src/modules/role/entities/role.entities";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        fullName: string;
        email: string;
        role: {
          id: number;
          name: string;
        };
        iat: number;
        exp: number;
      };
    }
  }
}
