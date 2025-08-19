import { ICategory } from "src/modules/categories/interfaces/categories-interface";
import UserEntity from "../../../modules/user/entities/user.entities";

export interface IPost {
    title: string;
    subtitle: string;
    content: string;
    category:ICategory;
    user: UserEntity,
    createAt: Date;
    updatAt: Date;
   
}