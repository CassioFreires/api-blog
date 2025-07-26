import UserEntity from "../../../modules/user/entities/user.entities";

export interface IPost {
    title: string;
    subtitle: string;
    content: string;
    user: UserEntity,
    createAt: Date;
    updatAt: Date;
   
}