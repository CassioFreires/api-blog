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

    async getAll(limit: number, page: number): Promise<IReturnResponse> {
        try {
            const [posts, total] = await this.repo.findAndCount({
                relations: ['user'],
                order: {
                    createAt: 'DESC'
                },
                skip: (page - 1) * limit,
                take: limit
            });

            return {
                message: 'Postagens encontradas com sucesso',
                pagination: {
                    currentPage: page,
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    perPage: limit,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPreviousPage: page > 1,
                    nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
                    previousPage: page > 1 ? page - 1 : null
                },
                data: posts
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }



    async getTop(): Promise<IPost[] | IReturnResponse> {
        try {
            const posts = await this.repo.find({
                relations: ['user'],
                order: {
                    createAt: 'DESC'
                },
                take: 3
            });
            return {
                message: 'Postagens encontradas com sucesso',
                data: posts,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<IPost | IReturnResponse> {
        try {
            const post = await this.repo.findOne({
                where: { id },
                relations: ['user']
            });
            if (!post) {
                return { message: 'Post não encontrado' };
            }
            return {
                message: 'Postagens encontradas com sucesso',
                data: post,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<IPost | IReturnResponse | null> {
        try {
            await this.repo.update(id, updatePostDto);
            const updatePost = await this.repo.findOne({ where: { id } });
            return updatePost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id: number): Promise<IPost | IReturnResponse | null> {
        try {
            const resultPost = await this.repo.findOne({ where: { id } });
            await this.repo.delete(id);
            return resultPost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}