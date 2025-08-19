"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class PostRepository {
    constructor() {
        this.table = "posts";
        this.userTable = "users";
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield (0, ps_config_1.default)(this.userTable).where({ id: data.user_id }).first();
                if (!userExists) {
                    return { message: "Usuário informado não existe." };
                }
                const [post] = yield (0, ps_config_1.default)(this.table)
                    .insert({
                    title: data.title,
                    content: data.content,
                    user_id: data.user_id,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                    .returning("*");
                return post;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAll(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = (page - 1) * limit;
                const [totalResult] = yield (0, ps_config_1.default)(this.table).count("* as total");
                const total = Number(totalResult.total);
                const posts = yield (0, ps_config_1.default)(this.table)
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getTop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pegando todas as categorias
                const categories = yield (0, ps_config_1.default)('categories').select('id', 'name', 'description');
                // Para cada categoria, pegar a última postagem
                const postsPromises = categories.map((cat) => __awaiter(this, void 0, void 0, function* () {
                    const [post] = yield (0, ps_config_1.default)(this.table)
                        .select("posts.*", "users.name as user_name", "users.email as user_email", "categories.id as category_id", "categories.name as category_name", "categories.description as category_description")
                        .join('categories', 'posts.category_id', 'categories.id')
                        .join('users', 'users.id', 'posts.user_id')
                        .where('categories.id', cat.id)
                        .orderBy('createAt', 'desc')
                        .limit(1); // só a última postagem de cada categoria
                    return post;
                }));
                const posts = (yield Promise.all(postsPromises)).filter(Boolean);
                return {
                    message: "Últimas postagens por categoria encontradas",
                    data: posts
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield (0, ps_config_1.default)(this.table)
                    .select("posts.*", "users.name as user_name", "users.email as user_email")
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
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    update(id, updatePostDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .update(Object.assign(Object.assign({}, updatePostDto), { updated_at: new Date() }));
                const updatedPost = yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .first();
                return updatedPost !== null && updatedPost !== void 0 ? updatedPost : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield (0, ps_config_1.default)(this.table).where({ id }).first();
                yield (0, ps_config_1.default)(this.table).where({ id }).del();
                return post !== null && post !== void 0 ? post : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllPostsByCategory(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!slug)
                return [];
            try {
                const posts = yield (0, ps_config_1.default)(this.table)
                    .join('categories', 'posts.category_id', 'categories.id')
                    .where('categories.slug', 'ilike', slug)
                    .orderBy('createAt', 'desc')
                    .select('posts.*');
                return posts;
            }
            catch (error) {
                console.error('Erro ao buscar posts por categoria:', error);
                throw error;
            }
        });
    }
}
exports.default = PostRepository;
