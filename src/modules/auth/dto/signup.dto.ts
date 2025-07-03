import { CreateUserDTO } from "../../../modules/user/dto/create-user.dto";

export class SignupAuthDto extends CreateUserDTO {
  role_id?:number;
  confirmPassword?:string;
}
