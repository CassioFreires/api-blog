import { IUser } from "src/modules/user/interfaces/user.interface";
import { IPost } from "src/modules/post/interfaces/post.interface";

export interface IComments {
    id:number;
    post:IPost;
    user:IUser;
    createAt:Date;
}