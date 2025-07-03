import { Response, Request } from "express";
import { IReturnResponse } from "./interfaces/response.comment.interface";
import { IComments } from "./interfaces/comment.interface";
import { CreateCommentDto } from "./dto/create-comment.dto";
import CommentService from "./comment.service";
import { validationCommentSchema } from "./schema/validation.comment.schema";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { validationCommentUpdateSchema } from "./schema/validation-update.comment";



export default class CommentController {
    constructor(private readonly commentService: CommentService) { }


    async create(req: Request, res: Response): Promise<Response<IReturnResponse<IComments>>> {
        const data: CreateCommentDto = req.body;
        const validation = validationCommentSchema.safeParse(data);

        if (!validation.success) {
            return res.status(400).json({
                message: 'Dados inválidos',
                error: validation.error.flatten().fieldErrors
            });
        }

        try {
            const comment = await this.commentService.create(validation.data);
            if (comment.data == null || !comment.data) {
                return res.status(400).json({
                    message: "Usuário ou Post não encontrados",
                    error: "IDs inválidos"
                })
            }
            return res.status(200).json({
                message: 'Comentário criado com sucesso',
                comment
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Erro interno ao tentar criar comentário!',
                error
            });
        }
    }

    async getAllCommentByPost(req: Request, res: Response): Promise<Response<IReturnResponse<IComments[]>>> {
        try {
            const post_id = req.params.post_id;
            const result = await this.commentService.getAllCommentsByPost(Number(post_id));
            return res.json({
                data: result
            })
        } catch (error: any) {
            if (error.code == '22P02') {
                return res.status(500).json({
                    message: 'Não foi enviado o parametro de entradada "post_id" no body'
                })
            }
            console.log(error)
            return res.status(500).json({
                message: 'Erro interno ao tentar contar os comentarios do post'
            })
        }
    }

    async getAll(req: Request, res: Response): Promise<Response<IReturnResponse<IComments[]>>> {
        try {
            const comment = await this.commentService.getAll();
            if (!comment) {
                return res.status(400).json({
                    message: 'Não existem comentarios',
                })
            }
            return res.json({ data: comment })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao buscar todos os comentarios',
                error,
            })
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IReturnResponse<IComments>>> {
        try {
            const id = Number(req.params.id);
            const comment = await this.commentService.getById(id);
            if (!comment.data || comment.data == null) {
                return res.status(400).json({
                    message: 'Não existe comentario com o "ID" passado por parametro'
                });
            }
            return res.json({
                comment
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: `Erro interno ao tentar localizar comentario através do "ID"`
            })
        }
    }

    async update(req: Request, res: Response): Promise<Response<IReturnResponse<IComments>>> {

        try {
            const id = Number(req.params.id);
            const data: UpdateCommentDto = req.body;
            const validation = validationCommentUpdateSchema.safeParse(data)

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Failed validation',
                    error: validation.error.flatten().fieldErrors
                })
            }


            if (!data?.content) {
                return res.status(400).json({
                    message: 'Campo "content" é obrigatório.'
                });
            }

            const commentExist = await this.commentService.getById(id);
            if (!commentExist.data) {
                return res.status(404).json({
                    message: 'Comentário não encontrado.'
                });
            }

            const updatedComment = await this.commentService.update(id, data);
            return res.json(updatedComment);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao atualizar o comentário.'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<Response<IReturnResponse<null>>> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Parâmetro "id" inválido'
                });
            }

            const deleted = await this.commentService.delete(id);

            if (!deleted.data) {
                return res.status(404).json({
                    message: deleted.message
                });
            }

            return res.status(200).json(deleted);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar deletar o comentário'
            });
        }
    }




}