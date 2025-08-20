import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        user: {
          id: string;
          role: {
            role_name: string;
          };
        };
      };
    }
  }
}
