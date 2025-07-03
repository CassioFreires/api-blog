import { IPost } from "../../post/interfaces/post.interface";
import { IUser } from "../../user/interfaces/user.interface";

export interface ILike {
  id: number;
  user: IUser;
  post: IPost;
  createdAt: Date;
}
