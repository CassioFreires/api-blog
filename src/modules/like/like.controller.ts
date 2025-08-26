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
            console.log(req.body)

            const validation = validationLikeSchema.safeParse({ user_id, post_id });
            if (!validation.success) {
                return res.status(400).json({
                    message: "Falha na validação",
                    error: validation.error.flatten().fieldErrors,
                });
            }

            const result = await this.likeService.toggle(validation.data);
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
            return res.status(500).json({
                message: "Erro interno ao processar like",
                error,
            });
        }
    }

    async countByPost(req: Request, res: Response): Promise<Response<IReturnResponse<number>>> {
        try {
            const post_id = Number(req.params.post_id);
            if (isNaN(post_id)) {
                return res.status(400).json({
                    message: "ID do post inválido",
                });
            }

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

    async delete(req:Request, res:Response): Promise<void | any> {
        try {
            const id = Number(req.params.id);
            const exists = await this.likeService.getById(id);
            if(exists.data == null || !exists.data) return res.status(400).json({message:`Like com "ID = ${id}" não existe!`});
            await this.likeService.delete(id);
            return res.json({message: `Like com "ID = ${id}" deletado com sucesso!`})
        }catch(error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno ao tentar deletar o like.'
            })
        }
    }
}
