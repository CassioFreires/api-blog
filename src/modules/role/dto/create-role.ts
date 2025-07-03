// entities/CreateRole.ts
import { IRole } from "../interfaces/Role.interface";

export class CreateRole implements IRole {
  id?: number; // pode ser undefined até o banco preencher
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
