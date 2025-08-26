import CommentRepository from "./comment.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { IComments } from "./interfaces/comment.interface";
import { IReturnResponse } from "./interfaces/response.comment.interface";

export default class CommentService {
    private readonly commentRepository = new CommentRepository();

    async create(data: CreateCommentDto): Promise<IReturnResponse<IComments>> {

        try {
            const comment = await this.commentRepository.create(data);
            return comment;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    async getAllCommentsByPost(post_id: number): Promise<IReturnResponse<IComments[]>> {
        try {
            const result = await this.commentRepository.getAllCommentsByPost(post_id);
            return result; // Retorna o objeto completo do repositório
        } catch (error: any) {
            console.error("Erro no serviço (getAllCommentsByPost):", error);
            throw error;
        }
    }

    async getAll(): Promise<IReturnResponse<IComments[]>> {
        try {
            const comments = await this.commentRepository.getAll();;
            return comments;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<IReturnResponse<IComments | null>> {
        try {
            const comment = await this.commentRepository.getById(id);
            return comment;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id: number, data: UpdateCommentDto): Promise<IReturnResponse<IComments | null>> {
        try {
            const updatedComment = await this.commentRepository.update(id, data);
            return updatedComment;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id: number): Promise<IReturnResponse<null>> {
        try {
            return await this.commentRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}