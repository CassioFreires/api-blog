import UserEntity from "../entities/user.entities";

export interface ReturnUserDTO {
  message: string;
  data: UserEntity | UserEntity[];
}