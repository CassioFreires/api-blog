export class CreatePostDto {
    id?:number;
    title!: string;
    subtitle!: string;
    content!: string;
    user_id!: number;
}