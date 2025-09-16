import { ICategory } from "src/modules/categories/interfaces/categories-interface";

export interface IPost {
    id?:number;
    title: string;
    subtitle: string;
    content: string;
    image_url?:string;
    category:ICategory;
    user_id?:number;
    user_name?:string;
    user_email?:string;
    createAt: Date;
    updatAt: Date;
   
}