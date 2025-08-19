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
class LikeRepository {
    constructor() {
        this.table = "likes";
    }
    toggle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, post_id } = data;
            try {
                const existing = yield (0, ps_config_1.default)(this.table)
                    .where({ user_id, post_id })
                    .first();
                if (existing) {
                    yield (0, ps_config_1.default)(this.table)
                        .where({ user_id, post_id })
                        .del();
                    return false; // Descurtido
                }
                yield (0, ps_config_1.default)(this.table).insert({
                    user_id,
                    post_id,
                    created_at: new Date(),
                });
                return true; // Curtido
            }
            catch (error) {
                console.error("Erro no toggle de like:", error);
                throw error;
            }
        });
    }
    countByPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [{ count }] = yield (0, ps_config_1.default)(this.table)
                    .where({ post_id })
                    .count("id as count");
                return Number(count);
            }
            catch (error) {
                console.error("Erro ao contar likes por post:", error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, ps_config_1.default)(this.table)
                    .select("*")
                    // Se quiser trazer dados de user e post, precisa de join com as tabelas:
                    .leftJoin("users", "likes.user_id", "users.id")
                    .leftJoin("posts", "likes.post_id", "posts.id");
                return {
                    data: result,
                    message: "Likes encontrados com sucesso",
                };
            }
            catch (error) {
                console.error(error);
                return {
                    error,
                    message: "Erro ao buscar likes",
                };
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .first();
                return {
                    data: result !== null && result !== void 0 ? result : null,
                    message: "Like encontrado com sucesso",
                };
            }
            catch (error) {
                console.error(error);
                return {
                    error,
                    message: "Erro ao buscar like",
                };
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, ps_config_1.default)(this.table).where({ id }).del();
            }
            catch (error) {
                console.error(`Erro ao deletar like com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.default = LikeRepository;
