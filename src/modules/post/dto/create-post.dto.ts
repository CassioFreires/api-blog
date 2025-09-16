export class CreatePostDto {
    id?:number;
    title!: string;
    subtitle!: string;
    category_id!:number;
    content!: string;
    image_url?:string;
    user_id!: number;
}