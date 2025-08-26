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

        console.log(data)
        console.log(validation)

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
            const itsAuthenticate = req.user?.user.id;

            const validation = validationCommentUpdateSchema.safeParse(data)

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Failed validation',
                    error: validation.error.flatten().fieldErrors
                })
            }

            const commentExist = await this.commentService.getById(id);

            if (!commentExist.data) {
                return res.status(404).json({
                    message: 'Comentário não encontrado.'
                });
            }


            if (itsAuthenticate !== commentExist.data.user_id) {
                return res.status(401).json({
                    message: 'Você não tem permissão para editar este comentario'
                })
            }


            const updatedComment = await this.commentService.update(commentExist.data.id, data);
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
            const commentId = Number(req.params.id);
            const authenticatedUserId = req.user?.user.id;

            if (!authenticatedUserId) {
                return res.status(401).json({ message: "Usuário não autenticado" });
            }

            const comment = await this.commentService.getById(commentId);
            if (!comment?.data) {
                return res.status(404).json({ message: "Comentário não encontrado" });
            }

            if (comment.data.user_id !== authenticatedUserId) {
                return res.status(403).json({ message: "Você não tem permissão para excluir este comentário" });
            }

            await this.commentService.delete(commentId);

            return res.status(200).json({ message: "Comentário deletado com sucesso", data: null });

        } catch (error: any) {
            if (error.message === "Comentário não encontrado") {
                return res.status(404).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: "Erro interno ao tentar deletar o comentário" });
        }
    }




}