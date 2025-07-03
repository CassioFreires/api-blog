
export class CreateUserDTO {
  name!:string;
  fullName!: string;
  email!: string;
  password_hash!: string;
  bio?:string;
  avatarUrl?:string;
  role_id?: number;
}