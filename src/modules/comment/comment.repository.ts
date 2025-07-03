import PsDatabase from "../../config/ps.config";
import { Repository } from "typeorm";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { IReturnResponse } from "./interfaces/response.comment.interface";
import { IComments } from "./interfaces/comment.interface";
import { CommentEntity } from "./entities/comment.entities";
import UserEntity from "../user/entities/user.entities";
import { PostEntity } from "../post/entities/post.entities";
import { UpdateCommentDto } from "./dto/update-comment.dto";

export default class CommentRepository {
    private repo: Repository<CommentEntity>;
    private repoUser: Repository<UserEntity>
    private repoPost: Repository<PostEntity>

    constructor() {
        this.repo = PsDatabase.getRepository(CommentEntity);
        this.repoUser = PsDatabase.getRepository(UserEntity);
        this.repoPost = PsDatabase.getRepository(PostEntity);
    }

    async create(data: CreateCommentDto): Promise<IReturnResponse<IComments>> {
        try {
            const userRepo = PsDatabase.getRepository(UserEntity);
            const postRepo = PsDatabase.getRepository(PostEntity);

            const user = await userRepo.findOneBy({ id: data.user_id });
            const post = await postRepo.findOneBy({ id: data.post_id });

            if (!user || !post) {
                return {
                    data: null,
                    message: "Usuário ou Post não encontrados",
                    error: "IDs inválidos"
                };
            }

            const comment = this.repo.create({
                content: data.content,
                user,
                post,
            });

            await this.repo.save(comment);

            return { message: 'Comentário criado com sucesso', data: comment };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllCommentsByPost(post_id: number): Promise<IReturnResponse<IComments[]>> {
        try {
            const comments = await this.repo.find({
                where: {
                    post: { id: post_id }
                },
                relations: ['user', 'post']
            });

            console.log(comments)
            if (!comments) {
                return {
                    message: 'Nenhum comentário encontrado para este post.',
                    data: null
                };
            }
            return {
                message: 'Todos os comentários do post com usuários e post',
                data: comments
            };

        } catch (error: any) {
            console.log(error)
            throw error;
        }
    }

    async getAll(): Promise<IReturnResponse<IComments[]>> {
        try {
            const results = await this.repo.find({
                relations: ['post', 'user']
            });
            return {
                message: 'Todos os comentarios',
                data: results
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<IReturnResponse<IComments>> {
        try {
            const comment = await this.repo.findOne({
                where: { id: id },
                relations: ['user', 'post']
            });
            if (!comment) {
                return {
                    message: 'Não foi localizado comentario com "ID" passado por parametro',
                    data: null,
                }
            };
            return { message: 'Comentario localizado', data: comment };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id: number, data: UpdateCommentDto): Promise<IReturnResponse<IComments>> {
        try {
            const comment = await this.repo.findOne({
                where: { id },
                relations: ['user', 'post']
            });

            if (!comment) {
                return {
                    message: 'Comentário não encontrado',
                    data: null
                };
            }

            await this.repo.update(id, data);
            const updated = await this.repo.findOne({
                where: { id },
                relations: ['user', 'post']
            });

            return {
                message: 'Comentário atualizado com sucesso',
                data: updated!
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id: number): Promise<IReturnResponse<null>> {
        try {
            const comment = await this.repo.findOneBy({ id });

            if (!comment) {
                return {
                    message: 'Comentário não encontrado',
                    data: null
                };
            }

            await this.repo.delete(id);

            return {
                message: 'Comentário deletado com sucesso',
                data: null
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }




}