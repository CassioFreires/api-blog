import db from "../../config/ps.config";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { IPost } from "./interfaces/post.interface";
import { IReturnResponse } from "./interfaces/response.interface";
import NodeCache from "node-cache";

// 🟢 cache em memória (TTL padrão: 60s)
const cache = new NodeCache({ stdTTL: 60 });

export default class PostRepository {
    private table = "posts";

    // ---------------- CRUD ----------------
    async create(data: CreatePostDto): Promise<IPost | IReturnResponse> {
        try {
            const post = await db.transaction(async (trx) => {
                const [newPost] = await trx(this.table)
                    .insert({ ...data, createAt: new Date(), updatAt: new Date() })
                    .returning("*");

                return newPost;
            });

            // ❌ Invalida cache relacionado
            cache.del("posts:*");

            return post;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll(limit: number, page: number): Promise<IReturnResponse> {
        const cacheKey = `posts:page=${page}:limit=${limit}`;

        const cached = cache.get<IReturnResponse>(cacheKey);
        if (cached) {
            console.log("✅ Cache HIT - getAll");
            return cached;
        }

        try {
            const offset = (page - 1) * limit;
            const [totalResult, posts] = await Promise.all([
                db(this.table).count("* as total").first(),
                db(this.table)
                    .select(
                        "posts.id",
                        "posts.title",
                        "posts.subtitle",
                        "posts.content",
                        "posts.image_url",
                        "posts.createAt",
                        "posts.updatAt",
                        "users.name as user_name",
                        "users.email as user_email",
                        "categories.slug as category_slug"
                    )
                    .join("users", "users.id", "posts.user_id")
                    .join("categories", "categories.id", "posts.category_id")
                    .orderBy([{ column: "createAt", order: "desc" }, { column: "id", order: "desc" }])
                    .limit(limit)
                    .offset(offset),
            ]);

            const total = Number(totalResult?.total ?? 0);
            const response: IReturnResponse = {
                message: "Postagens encontradas com sucesso",
                pagination: {
                    currentPage: page,
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    perPage: limit,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPreviousPage: page > 1,
                    nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
                    previousPage: page > 1 ? page - 1 : null,
                },
                data: posts,
            };

            cache.set(cacheKey, response);
            console.log("📦 Cache MISS - getAll (salvando no cache)");
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTop(): Promise<IReturnResponse> {
        const cacheKey = `posts:top`;

        const cached = cache.get<IReturnResponse>(cacheKey);
        if (cached) {
            console.log("✅ Cache HIT - getTop");
            return cached;
        }

        try {
            const posts = await db.with("RankedPosts", (qb) => {
                qb.select(
                    "p.*",
                    "u.name as user_name",
                    "u.email as user_email",
                    "c.name as category_name"
                )
                    .from("posts as p")
                    .join("users as u", "u.id", "p.user_id")
                    .join("categories as c", "c.id", "p.category_id")
                    .orderBy("p.createAt", "desc")
                    .groupBy("c.id", "p.id", "u.id"); // Adicione um GROUP BY para garantir que você obtenha um post por categoria
            }).select(
                "id",
                "title",
                "subtitle",
                "content",
                "user_id",
                "category_id",
                "createAt",
                "updatAt",
                "image_url",
                "user_name",
                "user_email",
                "category_name"
            ).from("RankedPosts").orderBy("createAt", "desc");

            // Lógica para obter a última postagem de cada categoria
            const latestPostsByCategory = new Map<number, any>();
            posts.forEach(post => {
                if (!latestPostsByCategory.has(post.category_id)) {
                    latestPostsByCategory.set(post.category_id, post);
                }
            });

            const result = {
                message: "Últimas postagens por categoria encontradas",
                data: Array.from(latestPostsByCategory.values()),
            };

            cache.set(cacheKey, result);
            console.log("📦 Cache MISS - getTop (salvando no cache)");
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getById(id: number): Promise<IReturnResponse> {
        const cacheKey = `post:${id}`;

        const cached = cache.get<IReturnResponse>(cacheKey);
        if (cached) {
            console.log("✅ Cache HIT - getById");
            return cached;
        }

        try {
            const post = await db(this.table)
                .select(
                    "posts.*",
                    "users.name as user_name",
                    "users.email as user_email",
                    "users.id as user_id",
                    "categories.name as category_name"
                )
                .join("users", "users.id", "posts.user_id")
                .join("categories", "categories.id", "posts.category_id")
                .where("posts.id", id)
                .first();

            if (!post) return { message: "Post não encontrado" };

            const response: IReturnResponse = { message: "Postagem encontrada com sucesso", data: post };
            cache.set(cacheKey, response);

            console.log("📦 Cache MISS - getById (salvando no cache)");
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<IPost | IReturnResponse | null> {
        try {
            const updatedPost = await db.transaction(async (trx) => {
                const [post] = await trx(this.table)
                    .where({ id })
                    .update({
                        ...updatePostDto,
                        updatAt: new Date()  // corrigido: estava "updatAt"
                    })
                    .returning("*"); // retorna o post atualizado

                return post ?? null;
            });

            if (updatedPost) {
                cache.del([`post:${id}`, "posts:*"]);
            }

            return updatedPost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id: number): Promise<IPost | IReturnResponse | null> {
        try {
            const deletedPost = await db.transaction(async (trx) => {
                const [post] = await trx(this.table).where({ id }).del().returning("*");
                return post ?? null;
            });

            if (deletedPost) {
                cache.del([`post:${id}`, "posts:*"]);
            }

            return deletedPost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllPostsByCategory(slug: string): Promise<IPost[]> {
        if (!slug) return [];
        try {
            return await db(this.table)
                .join("categories", "posts.category_id", "categories.id")
                .join("users", "users.id", "posts.user_id")
                .where("categories.slug", "ilike", slug)
                .orderBy("createAt", "desc")
                .select("posts.*", "users.name as user_name", "users.email as user_email", "categories.name as category_name");
        } catch (error) {
            console.error("Erro ao buscar posts por categoria:", error);
            throw error;
        }
    }

    async allPostsByUser(userId: number): Promise<IPost[] | IReturnResponse> {
        try {
            const posts = await db(this.table)
                .select("posts.*", "users.name as user_name", "users.email as user_email")
                .join("users", "users.id", "posts.user_id")
                .where("posts.user_id", userId)
                .orderBy("createAt", "desc");

            if (posts.length === 0) return { message: "Nenhum post encontrado para este usuário." };
            return posts;
        } catch (error) {
            console.error("Erro ao buscar posts por usuário:", error);
            throw error;
        }
    }
}
