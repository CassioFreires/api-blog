// like.controller.ts
import { Request, Response } from "express";
import LikeService from "./like.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { validationLikeSchema } from "./schema/validation-like.schema";
import { IReturnResponse } from "./interfaces/response.interface";
import { ILike } from "./interfaces/like.interface";

export default class LikeController {
    constructor(private readonly likeService: LikeService) { }

    async toggle(req: Request, res: Response): Promise<Response<IReturnResponse>> {
        try {
            const { user_id, post_id }: CreateLikeDto = req.body;

            const validation = validationLikeSchema.safeParse({ user_id, post_id });
            if (!validation.success) {
                return res.status(400).json({
                    message: "Falha na validação",
                    error: validation.error.flatten().fieldErrors,
                });
            }

            const result = await this.likeService.toggle(validation.data);
            console.log(result)
            return res.status(200).json(result);
        } catch (error: any) {
            console.log(error.code)
            if (error.code == "23503") {
                return res.status(400).json({
                    message: "Usuário ou post informado não existe no sistema.",
                    error: error.detail || "Chave estrangeira inválida"
                });
            }
            console.error("[LikeController][toggle]", error);
            return res.status(500).json({ message: "Erro interno ao processar like", error });
        }
    }

    async countByPost(req: Request, res: Response): Promise<Response<IReturnResponse<number>>> {
        try {
            const post_id = Number(req.params.post_id);

            const result = await this.likeService.countByPost(post_id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("[LikeController][countByPost]", error);
            return res.status(500).json({
                message: "Erro interno ao contar curtidas",
                error,
            });
        }
    }

    async countByMultiplePosts(req: Request, res: Response): Promise<Response> {
        try {
            const postIds: number[] = req.body.postIds; // recebe array de postIds
            if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
                return res.status(400).json({ message: "Informe um array de postIds válido" });
            }

            const result = await this.likeService.countByMultiplePosts(postIds);
            console.log(result)
            return res.status(200).json(result);
        } catch (error) {
            console.error("[LikeController][countByMultiplePosts]", error);
            return res.status(500).json({ message: "Erro ao contar curtidas de múltiplos posts", error });
        }
    }


    async getAll(req: Request, res: Response): Promise<Response<IReturnResponse<ILike[]>>> {
        try {
            const result = await this.likeService.getAll();

            if (!result.data || result.data.length === 0) {
                return res.status(404).json({
                    message: 'Não existe nenhum like registrado',
                    data: [],
                });
            }

            return res.json(result); // ✔ Já está no formato IReturnResponse<ILike[]>
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar buscar todas as curtidas',
                error,
            });
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IReturnResponse<ILike>>> {
        try {
            const id = Number(req.params.id);
            const result = await this.likeService.getById(id);
            console.log(result)

            if (!result.data || !result || result.data == null) {
                return res.status(404).json({
                    message: 'Não existe nenhum like registrado',
                    data: [],
                });
            }

            return res.json(result); // ✔ Já está no formato IReturnResponse<ILike>
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar buscar o like através do "ID"',
                error,
            });
        }
    }

    async getUserLiked(req: Request, res: Response): Promise<Response> {
        try {
            const { postId } = req.params;
            const userId = req.user?.user?.id; // vem do token

            if (!userId) {
                return res.status(401).json({ liked: false, message: "Usuário não autenticado" });
            }

            if (!postId || isNaN(Number(postId))) {
                return res.status(400).json({ liked: false, message: "postId inválido" });
            }

            let liked = false;
            try {
                liked = await this.likeService.getUserLiked(Number(userId), Number(postId));
            } catch (err) {
                console.error("[LikeController][getUserLiked][Service]", err);
                return res.status(500).json({ liked: false, message: "Erro ao verificar like no serviço" });
            }

            return res.status(200).json({ liked });
        } catch (error) {
            console.error("[LikeController][getUserLiked][Controller]", error);
            return res.status(500).json({ liked: false, message: "Erro interno ao verificar like" });
        }
    }



    async delete(req: Request, res: Response): Promise<void | any> {
        try {
            const id = Number(req.params.id);
            const exists = await this.likeService.getById(id);
            if (exists.data == null || !exists.data) return res.status(400).json({ message: `Like com "ID = ${id}" não existe!` });
            await this.likeService.delete(id);
            return res.json({ message: `Like com "ID = ${id}" deletado com sucesso!` })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar deletar o like.'
            })
        }
    }
}
