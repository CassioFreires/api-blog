import { IUser } from "./user.interface";

export interface ReturnUserDTO {
  message: string;
  data: IUser | IUser[];
}