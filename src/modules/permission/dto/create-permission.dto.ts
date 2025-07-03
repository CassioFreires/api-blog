// entities/CreateRole.ts
import { IPermission } from "../interfaces/permission.interface";
export class CreatePermission implements IPermission {
  id?: number; // pode ser undefined até o banco preencher
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
