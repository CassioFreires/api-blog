import UserEntity from "../../../modules/user/entities/user.entities";
import { PostEntity } from "../../../modules/post/entities/post.entities";

export interface IComments {
    id:number;
    post:PostEntity;
    user:UserEntity;
    createAt:Date;
}