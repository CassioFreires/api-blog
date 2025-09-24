import { IRole } from "src/modules/role/interfaces/role.interface";

export interface IUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  role: IRole ; // adicione isso
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}