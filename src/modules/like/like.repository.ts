// like.repository.ts
import { Repository } from "typeorm";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikeEntity } from "./entities/like.entities";
import UserEntity from "../user/entities/user.entities";
import PsDatabase from "../../config/ps.config";
import { PostEntity } from "../post/entities/post.entities";
import { IReturnResponse } from "./interfaces/response.interface";
import { ILike } from "./interfaces/like.interface";

export default class LikeRepository {
  private repo: Repository<LikeEntity> = PsDatabase.getRepository(LikeEntity);

  async toggle(data: CreateLikeDto): Promise<boolean> {
    const { user_id, post_id } = data;

    const existing = await this.repo.findOne({
      where: {
        user: { id: user_id },
        post: { id: post_id },
      },
      relations: ["user", "post"],
    });

    if (existing) {
      await this.repo.remove(existing);
      return false; // Descurtido
    }

    const like = this.repo.create({
      user: { id: user_id } as UserEntity,
      post: { id: post_id } as PostEntity,
    });

    await this.repo.save(like);
    return true; // Curtido
  }

  async countByPost(post_id: number): Promise<number> {
    return await this.repo.count({
      where: {
        post: { id: post_id },
      },
    });
  }

  async getAll(): Promise<IReturnResponse<ILike[]>> {
    try {
      const result = await this.repo.find({
        relations: ['user', 'post']
      });

      return {
        data: result,
        message: 'Likes encontrados com sucesso',
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        message: 'Erro ao buscar likes',
      };
    }
  }

  async getById(id: number): Promise<IReturnResponse<ILike>> {
    try {
      const result = await this.repo.findOne({
        where: { id: id },
        relations: ['user', 'post']
      });
      return {
        data: result,
        message: 'Likes encontrados com sucesso',
      };
    } catch (error) {
      console.log(error);
      return {
        error,
        message: 'Erro ao buscar likes',
      };
    }
  }

  async delete(id: number): Promise<void | any> {
    try {
      const remove = await this.repo.delete({ id: id });
      return remove;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
