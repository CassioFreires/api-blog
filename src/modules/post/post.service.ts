import UserEntity from "../user/entities/user.entities";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { IPost } from "./interfaces/post.interface";
import { IReturnResponse } from "./interfaces/response.interface";
import PostRepository from "./post.repository";

export default class PostService {
    private readonly postRepository = new PostRepository()

    async create(data: CreatePostDto): Promise<IPost | IReturnResponse> {
        try {
            const newData = {
                title: data.title.toLocaleLowerCase(),
                subtitle: data.subtitle.toLocaleLowerCase(),
                content: data.content.toLocaleLowerCase(),
                user: { id: data.user_id } as UserEntity
            }
            const post = await this.postRepository.create(newData);
            return post;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAll(limit:number, page:number): Promise<IReturnResponse> {
        try {
            const posts = await this.postRepository.getAll(limit, page);
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTop(): Promise<IPost[] | IReturnResponse> {
        try {
            const posts = await this.postRepository.getTop();
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<IPost | IReturnResponse | null> {
        try {
            const post = await this.postRepository.getById(id);
            return post;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<IPost | IReturnResponse | null> {
        try {

            const newUpdatePostDto = {
                title: updatePostDto.title?.toLocaleLowerCase(),
                subtitle: updatePostDto.subtitle?.toLocaleLowerCase(),
                content: updatePostDto.content?.toLocaleLowerCase()
            }
            const updatePost = await this.postRepository.update(id, newUpdatePostDto);
            return updatePost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id: number): Promise<IPost | IReturnResponse | null> {
        try {
            const post = await this.postRepository.delete(id);
            return post;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}