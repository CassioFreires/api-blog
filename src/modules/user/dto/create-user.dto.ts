
export class CreateUserDTO {
  name!:string;
  lastName!: string;
  email!: string;
  password_hash!: string;
  bio?:string;
  avatarUrl?:string;
  role_id?: number;
}