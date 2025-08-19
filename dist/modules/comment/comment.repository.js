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
class CommentRepository {
    constructor() {
        this.table = "comments";
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, ps_config_1.default)("users").where({ id: data.user_id }).first();
                const post = yield (0, ps_config_1.default)("posts").where({ id: data.post_id }).first();
                if (!user || !post) {
                    return {
                        data: null,
                        message: "Usuário ou Post não encontrados",
                        error: "IDs inválidos",
                    };
                }
                const [insertedId] = yield (0, ps_config_1.default)(this.table).insert({
                    content: data.content,
                    user_id: data.user_id,
                    post_id: data.post_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                const comment = yield (0, ps_config_1.default)(this.table)
                    .select("comments.*", "users.id as user_id", "users.name as user_name", "posts.id as post_id", "posts.title as post_title")
                    .leftJoin("users", "comments.user_id", "users.id")
                    .leftJoin("posts", "comments.post_id", "posts.id")
                    .where("comments.id", insertedId)
                    .first();
                return {
                    message: "Comentário criado com sucesso",
                    data: comment,
                };
            }
            catch (error) {
                console.error("Erro ao criar comentário:", error);
                throw error;
            }
        });
    }
    getAllCommentsByPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield (0, ps_config_1.default)(this.table)
                    .select("comments.*", "users.id as user_id", "users.name as user_name", "posts.id as post_id", "posts.title as post_title")
                    .leftJoin("users", "comments.user_id", "users.id")
                    .leftJoin("posts", "comments.post_id", "posts.id")
                    .where("comments.post_id", post_id);
                if (comments.length === 0) {
                    return {
                        message: "Nenhum comentário encontrado para este post.",
                        data: [],
                    };
                }
                return {
                    message: "Todos os comentários do post com usuários e post",
                    data: comments,
                };
            }
            catch (error) {
                console.error("Erro ao buscar comentários por post:", error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield (0, ps_config_1.default)(this.table)
                    .select("comments.*", "users.id as user_id", "users.name as user_name", "posts.id as post_id", "posts.title as post_title")
                    .leftJoin("users", "comments.user_id", "users.id")
                    .leftJoin("posts", "comments.post_id", "posts.id");
                return {
                    message: "Todos os comentários",
                    data: results,
                };
            }
            catch (error) {
                console.error("Erro ao buscar todos os comentários:", error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield (0, ps_config_1.default)(this.table)
                    .select("comments.*", "users.id as user_id", "users.name as user_name", "posts.id as post_id", "posts.title as post_title")
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
                    data: comment,
                };
            }
            catch (error) {
                console.error("Erro ao buscar comentário por ID:", error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield (0, ps_config_1.default)(this.table).where({ id }).first();
                if (!comment) {
                    return {
                        message: "Comentário não encontrado",
                        data: null,
                    };
                }
                yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .update({
                    content: data.content,
                    updated_at: new Date(),
                });
                const updated = yield this.getById(id);
                return {
                    message: "Comentário atualizado com sucesso",
                    data: updated.data,
                };
            }
            catch (error) {
                console.error("Erro ao atualizar comentário:", error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield (0, ps_config_1.default)(this.table).where({ id }).first();
                if (!comment) {
                    return {
                        message: "Comentário não encontrado",
                        data: null,
                    };
                }
                yield (0, ps_config_1.default)(this.table).where({ id }).del();
                return {
                    message: "Comentário deletado com sucesso",
                    data: null,
                };
            }
            catch (error) {
                console.error("Erro ao deletar comentário:", error);
                throw error;
            }
        });
    }
}
exports.default = CommentRepository;
