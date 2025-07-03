// src/modules/role/interfaces/role.interface.ts
export interface IRole {
  id?: number;
  name: string;
  description?: string; // <-- mudar para opcional
  createdAt?: Date;
  updatedAt?: Date;
}
