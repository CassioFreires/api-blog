// entities/CreateRole.ts

export class CreateRole{
  id?: number; // pode ser undefined até o banco preencher
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
