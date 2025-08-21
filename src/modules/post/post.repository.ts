import db from "../../config/ps.config";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { IPost } from "./interfaces/post.interface";
import { IReturnResponse } from "./interfaces/response.interface";

export default class PostRepository {
  private table = "posts";
  private userTable = "users";

  async create(data: CreatePostDto): Promise<IPost | IReturnResponse> {
    try {
      const userExists = await db(this.userTable).where({ id: data.user_id }).first();

      if (!userExists) {
        return { message: "Usuário informado não existe." };
      }

      const [post] = await db(this.table)
        .insert({
          title: data.title,
          subtitle: data.subtitle,
          content: data.content,
          category_id: data.category_id,
          user_id: data.user_id,
          createAt: new Date(),
          updatAt: new Date()
        })
        .returning("*");

      return post;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAll(limit: number, page: number): Promise<IReturnResponse> {
    try {
      const offset = (page - 1) * limit;

      const [totalResult] = await db(this.table).count("* as total");
      const total = Number(totalResult.total);

      const posts = await db(this.table)
        .select("posts.*", "users.name as user_name", "users.email as user_email")
        .join("users", "users.id", "posts.user_id")
        .orderBy([{ column: "createAt", order: "desc" }, { column: "id", order: "desc" }]) // 👈 garante consistência
        .limit(limit)
        .offset(offset);

      return {
        message: "Postagens encontradas com sucesso",
        pagination: {
          currentPage: page,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          perPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
          nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null
        },
        data: posts
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTop(): Promise<IReturnResponse> {
    try {
      // Pegando todas as categorias
      const categories = await db('categories').select('id', 'name', 'description');

      // Para cada categoria, pegar a última postagem
      const postsPromises = categories.map(async (cat) => {
        const [post] = await db(this.table)
          .select(
            "posts.*",
            "users.name as user_name",
            "users.email as user_email",
            "categories.id as category_id",
            "categories.name as category_name",
            "categories.description as category_description"
          )
          .join('categories', 'posts.category_id', 'categories.id')
          .join('users', 'users.id', 'posts.user_id')
          .where('categories.id', cat.id)
          .orderBy('createAt', 'desc')
          .limit(1); // só a última postagem de cada categoria
        return post;
      });

      const posts = (await Promise.all(postsPromises)).filter(Boolean);

      return {
        message: "Últimas postagens por categoria encontradas",
        data: posts
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async getById(id: number): Promise<IReturnResponse> {
    try {
      const post = await db(this.table)
        .select("posts.*", "users.name as user_name", "users.email as user_email", "users.id as user_id")
        .join("users", "users.id", "posts.user_id")
        .where("posts.id", id)
        .first();

      if (!post) {
        return { message: "Post não encontrado" };
      }

      return {
        message: "Postagem encontrada com sucesso",
        data: post
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<IPost | IReturnResponse | null> {
    try {
      await db(this.table)
        .where({ id })
        .update({ ...updatePostDto, updatAt: new Date() });

      const updatedPost = await db(this.table)
        .where({ id })
        .first();

      return updatedPost ?? null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async delete(id: number): Promise<IPost | IReturnResponse | null> {
    try {
      const post = await db(this.table).where({ id }).first();
      await db(this.table).where({ id }).del();
      return post ?? null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllPostsByCategory(slug: string): Promise<IPost[]> {
    if (!slug) return [];

    try {
      const posts = await db(this.table)
        .join('categories', 'posts.category_id', 'categories.id')
        .where('categories.slug', 'ilike', slug)
        .orderBy('createAt', 'desc')
        .select('posts.*');

      return posts;
    } catch (error) {
      console.error('Erro ao buscar posts por categoria:', error);
      throw error;
    }
  }
  async allPostsByUser(userId: number): Promise<IPost[] | IReturnResponse> {
    try {
      const posts = await db(this.table)
        .select("posts.*", "users.name as user_name", "users.email as user_email")
        .join("users", "users.id", "posts.user_id")
        .where("posts.user_id", userId)
        .orderBy('createAt', 'desc');

      if (posts.length === 0) {
        return { message: "Nenhum post encontrado para este usuário." };
      }

      return posts;
    } catch (error) {
      console.error('Erro ao buscar posts por usuário:', error);
      throw error;
    }
  }
  
}
