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
// like.service.ts
const post_repository_1 = __importDefault(require("../post/post.repository"));
const like_repository_1 = __importDefault(require("./like.repository"));
class LikeService {
    constructor() {
        this.likeRepository = new like_repository_1.default();
        this.postRepository = new post_repository_1.default();
    }
    toggle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const liked = yield this.likeRepository.toggle(data);
                return {
                    data: null,
                    message: liked ? "Like adicionado com sucesso" : "Like removido com sucesso",
                };
            }
            catch (error) {
                // ⚠️ Tratamento de erro de chave estrangeira (PostgreSQL)
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
        });
    }
    countByPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existsPost = yield this.postRepository.getById(post_id);
                if (!existsPost) {
                    return {
                        message: `Não existe nenhum post com "ID = ${post_id}" passado.`
                    };
                }
                const count = yield this.likeRepository.countByPost(post_id);
                return {
                    data: count,
                    message: `Post ${post_id} possui ${count} curtida(s)`,
                };
            }
            catch (error) {
                console.error("[LikeService][countByPost]", error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.likeRepository.getAll();
                return result;
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
                const result = yield this.likeRepository.getById(id);
                return result;
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
                const result = yield this.likeRepository.delete(id);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = LikeService;
