import db from "../../config/ps.config";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { IReturnResponse } from "./interfaces/response.comment.interface";
import { IComments } from "./interfaces/comment.interface";

export default class CommentRepository {
  private table = "comments";

  // CommentRepository.ts

  async create(data: CreateCommentDto): Promise<IReturnResponse<IComments>> {
    try {
      const user = await db("users").where({ id: data.user_id }).first();
      const post = await db("posts").where({ id: data.post_id }).first();

      if (!user || !post) {
        return {
          data: null,
          message: "Usuário ou Post não encontrados",
          error: "IDs inválidos",
        };
      }

      const insertedResult = await db(this.table)
        .insert({
          content: data.content,
          user_id: data.user_id,
          post_id: data.post_id,
          createAt: new Date(),
          updateAt: new Date(),
        })
        .returning('id');

      // A CORREÇÃO ESTÁ AQUI
      // insertedResult é um array de objetos, ex: [{ id: 154 }]
      // Acessamos o id da primeira (e única) linha inserida
      const insertedId = insertedResult[0].id;

      const comment = await db(this.table)
        .select(
          "comments.*",
          "users.id as user_id",
          "users.name as user_name",
          "posts.id as post_id",
          "posts.title as post_title"
        )
        .leftJoin("users", "comments.user_id", "users.id")
        .leftJoin("posts", "comments.post_id", "posts.id")
        .where("comments.id", insertedId)
        .first();

      return {
        message: "Comentário criado com sucesso",
        data: comment as IComments,
      };
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      throw error;
    }
  }
  // Ajuste também esta função para garantir a consistência
  async getAllCommentsByPost(post_id: number): Promise<IReturnResponse<IComments[]>> {
    try {
      const comments = await db(this.table)
        .select(
          "comments.*",
          "users.id as user_id",
          "users.name as user_name",
          "posts.id as post_id",
          "posts.title as post_title"
        )
        .leftJoin("users", "comments.user_id", "users.id")
        .leftJoin("posts", "comments.post_id", "posts.id")
        .where("comments.post_id", post_id);

      return {
        message: "Todos os comentários do post com usuários e post",
        data: comments as IComments[],
      };
    } catch (error) {
      console.error("Erro ao buscar comentários por post:", error);
      throw error;
    }

  }

  async getAll(): Promise<IReturnResponse<IComments[]>> {
    try {
      const results = await db(this.table)
        .select(
          "comments.*",
          "users.id as user_id",
          "users.name as user_name",
          "posts.id as post_id",
          "posts.title as post_title"
        )
        .leftJoin("users", "comments.user_id", "users.id")
        .leftJoin("posts", "comments.post_id", "posts.id");

      return {
        message: "Todos os comentários",
        data: results as IComments[],
      };
    } catch (error) {
      console.error("Erro ao buscar todos os comentários:", error);
      throw error;
    }
  }

  async getById(id: number): Promise<IReturnResponse<IComments | null>> {
    try {
      const comment = await db(this.table)
        .select(
          "comments.*",
          "users.id as user_id",
          "users.name as user_name",
          "posts.id as post_id",
          "posts.title as post_title"
        )
        .leftJoin("users", "comments.user_id", "users.id")
        .leftJoin("posts", "comments.post_id", "posts.id")
        .where("comments.id", id)
        .first();

      if (!comment) {
        return {
          message: 'Não foi localizado comentário com "ID" passado por parâmetro',
          data: null,
        };
      }

      return {
        message: "Comentário localizado",
        data: comment as IComments,
      };
    } catch (error) {
      console.error("Erro ao buscar comentário por ID:", error);
      throw error;
    }
  }

  async update(id: number, data: UpdateCommentDto): Promise<IReturnResponse<IComments | null>> {
    try {
      const comment = await db(this.table).where({ id }).first();

      if (!comment) {
        return {
          message: "Comentário não encontrado",
          data: null,
        };
      }

      await db(this.table)
        .where({ id })
        .update({
          content: data.content,
          updateAt: new Date(),
        });

      const updated = await this.getById(id);

      return {
        message: "Comentário atualizado com sucesso",
        data: updated.data!,
      };
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<IReturnResponse<null>> {
    try {
      const comment = await db(this.table).where({ id }).first();

      if (!comment) {
        throw new Error("Comentário não encontrado");
      }

      await db(this.table).where({ id }).del();

      return {
        message: "Comentário deletado com sucesso",
        data: null,
      };
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      throw error;
    }
  }
}
