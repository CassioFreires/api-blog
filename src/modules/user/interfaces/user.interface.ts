import { RoleEntity } from "src/modules/role/entities/role.entities";

export interface IUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  role: RoleEntity ; // adicione isso
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}