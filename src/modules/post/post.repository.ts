import { CreatePostDto } from "./dto/create-post.dto";
import { PostEntity } from "./entities/post.entities";
import { DeepPartial, Repository } from "typeorm";
import PsDatabase from "../../config/ps.config";
import { IPost } from "./interfaces/post.interface";
import UserEntity from "../user/entities/user.entities";
import { IReturnResponse } from "./interfaces/response.interface";
import { UpdatePostDto } from "./dto/update-post.dto";

export default class PostRepository {
    private repo: Repository<PostEntity>
    private repoUser: Repository<UserEntity>
    constructor() {
        this.repo = PsDatabase.getRepository(PostEntity);
        this.repoUser = PsDatabase.getRepository(UserEntity);
    }

    async create(data: DeepPartial<PostEntity>): Promise<IPost | IReturnResponse> {
        try {
            const userExists = await this.repoUser.findOneBy({ id: data.user?.id })
            if (!userExists) {
                return { message: 'Usuário informado não existe.' }
            }
            const post = await this.repo.create(data);
            return this.repo.save(post);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async getAll(): Promise<IPost[] | IReturnResponse> {
        try {
            const posts = await this.repo.find({ relations: ['user'] });
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<IPost | IReturnResponse | null> {
        try {
            const post = await this.repo.findOne({
                where: { id },
                relations: ['user']
            });
            return post;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<IPost | IReturnResponse | null> {
        try {
            await this.repo.update(id, updatePostDto);
            const updatePost = await this.repo.findOne({where: {id}});
            return updatePost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id:number):Promise<IPost | IReturnResponse | null> {
        try {
            const resultPost = await this.repo.findOne({where: {id}});
            await this.repo.delete(id);
            return resultPost;
        }catch(error) {
            console.log(error);
            throw error;
        }
    }
}