import db from "../../config/ps.config";
import { CreateLikeDto } from "./dto/create-like.dto";
import { IReturnResponse } from "./interfaces/response.interface";
import { ILike } from "./interfaces/like.interface";

export default class LikeRepository {
  private table = "likes";

  async toggle(data: CreateLikeDto): Promise<boolean> {
    const { user_id, post_id } = data;

    try {
      const existing = await db(this.table)
        .where({ user_id, post_id })
        .first();

      if (existing) {
        await db(this.table)
          .where({ user_id, post_id })
          .del();
        return false; // Descurtido
      }

      await db(this.table).insert({
        user_id,
        post_id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return true; // Curtido
    } catch (error) {
      console.error("Erro no toggle de like:", error);
      throw error;
    }
  }

  async countByPost(post_id: number): Promise<number> {
    try {
      const [{ count }] = await db(this.table)
        .where({ post_id })
        .count<{ count: string }>("id as count") as any;

      return Number(count);
    } catch (error) {
      console.error("Erro ao contar likes por post:", error);
      throw error;
    }
  }

  async getAll(): Promise<IReturnResponse<ILike[]>> {
    try {
      const result = await db(this.table)
        .select("*")
        // Se quiser trazer dados de user e post, precisa de join com as tabelas:
        .leftJoin("users", "likes.user_id", "users.id")
        .leftJoin("posts", "likes.post_id", "posts.id");

      return {
        data: result,
        message: "Likes encontrados com sucesso",
      };
    } catch (error) {
      console.error(error);
      return {
        error,
        message: "Erro ao buscar likes",
      };
    }
  }

  async getById(id: number): Promise<IReturnResponse<ILike | null>> {
    try {
      const result = await db(this.table)
        .where({ id })
        .first();

      return {
        data: result ?? null,
        message: "Like encontrado com sucesso",
      };
    } catch (error) {
      console.error(error);
      return {
        error,
        message: "Erro ao buscar like",
      };
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db(this.table).where({ id }).del();
    } catch (error) {
      console.error(`Erro ao deletar like com id ${id}:`, error);
      throw error;
    }
  }
}
