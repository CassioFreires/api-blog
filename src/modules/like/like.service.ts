// like.service.ts
import PostRepository from "../post/post.repository";
import { CreateLikeDto } from "./dto/create-like.dto";
import { ILike } from "./interfaces/like.interface";
import { IReturnResponse } from "./interfaces/response.interface";
import LikeRepository from "./like.repository";

export default class LikeService {
    private readonly likeRepository = new LikeRepository();
    private readonly postRepository = new PostRepository();

    async toggle(data: CreateLikeDto): Promise<IReturnResponse<{ user_liked: boolean, likes_count: number }>> {
        try {
            const { liked, likesCount } = await this.likeRepository.toggle(data);

            return {
                data: {
                    user_liked: liked,
                    likes_count: likesCount
                },
                message: liked ? "Like adicionado com sucesso" : "Like removido com sucesso"
            };

        } catch (error: any) {
            if (error.code === "23503") {
                return {
                    data: null,
                    message: "Usuário ou post informado não existe.",
                    error: error.detail || "Chave estrangeira inválida"
                };
            }
            console.error("[LikeService][toggle]", error);
            throw new Error("Erro ao processar like");
        }
    }


    async countByPost(post_id: number): Promise<IReturnResponse<number>> {
        try {
            const existsPost = await this.postRepository.getById(post_id);
            if (!existsPost) {
                return {
                    message: `Não existe nenhum post com "ID = ${post_id}" passado.`
                }
            }
            const count = await this.likeRepository.countByPost(post_id);
            return {
                data: count,
                message: `Post ${post_id} possui ${count} curtida(s)`,
            };
        } catch (error) {
            console.error("[LikeService][countByPost]", error);
            throw error;
        }
    }

    async countByMultiplePosts(postIds: number[]): Promise<IReturnResponse<Record<number, number>>> {
        try {
            const counts = await this.likeRepository.countByMultiplePosts(postIds);
            return {
                data: counts,
                message: "Curtidas contadas com sucesso para todos os posts",
            };
        } catch (error) {
            console.error("[LikeService][countByPosts]", error);
            throw error;
        }
    }

    async getAll(): Promise<IReturnResponse<ILike[]>> {
        try {
            const result = await this.likeRepository.getAll();
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id: number): Promise<IReturnResponse<ILike | null>> {
        try {
            const result = await this.likeRepository.getById(id);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUserLiked(user_id: number, post_id: number): Promise<boolean> {
        if (!user_id || !post_id) {
            throw new Error("Parâmetros inválidos: user_id e post_id são obrigatórios");
        }

        try {
            return await this.likeRepository.getUserLiked(user_id, post_id);
        } catch (error) {
            console.error("[LikeService][getUserLiked]", error);
            throw new Error("Erro ao acessar o repositório de likes");
        }
    }


    async delete(id: number): Promise<void | any> {
        try {
            const result = await this.likeRepository.delete(id);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
