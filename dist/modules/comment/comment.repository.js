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
const comment_entities_1 = require("./entities/comment.entities");
const user_entities_1 = __importDefault(require("../user/entities/user.entities"));
const post_entities_1 = require("../post/entities/post.entities");
class CommentRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(comment_entities_1.CommentEntity);
        this.repoUser = ps_config_1.default.getRepository(user_entities_1.default);
        this.repoPost = ps_config_1.default.getRepository(post_entities_1.PostEntity);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepo = ps_config_1.default.getRepository(user_entities_1.default);
                const postRepo = ps_config_1.default.getRepository(post_entities_1.PostEntity);
                const user = yield userRepo.findOneBy({ id: data.user_id });
                const post = yield postRepo.findOneBy({ id: data.post_id });
                if (!user || !post) {
                    return {
                        data: null,
                        message: "Usuário ou Post não encontrados",
                        error: "IDs inválidos"
                    };
                }
                const comment = this.repo.create({
                    content: data.content,
                    user,
                    post,
                });
                yield this.repo.save(comment);
                return { message: 'Comentário criado com sucesso', data: comment };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllCommentsByPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comments = yield this.repo.find({
                    where: {
                        post: { id: post_id }
                    },
                    relations: ['user', 'post']
                });
                console.log(comments);
                if (!comments) {
                    return {
                        message: 'Nenhum comentário encontrado para este post.',
                        data: null
                    };
                }
                return {
                    message: 'Todos os comentários do post com usuários e post',
                    data: comments
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.repo.find({
                    relations: ['post', 'user']
                });
                return {
                    message: 'Todos os comentarios',
                    data: results
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
                const comment = yield this.repo.findOne({
                    where: { id: id },
                    relations: ['user', 'post']
                });
                if (!comment) {
                    return {
                        message: 'Não foi localizado comentario com "ID" passado por parametro',
                        data: null,
                    };
                }
                ;
                return { message: 'Comentario localizado', data: comment };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.repo.findOne({
                    where: { id },
                    relations: ['user', 'post']
                });
                if (!comment) {
                    return {
                        message: 'Comentário não encontrado',
                        data: null
                    };
                }
                yield this.repo.update(id, data);
                const updated = yield this.repo.findOne({
                    where: { id },
                    relations: ['user', 'post']
                });
                return {
                    message: 'Comentário atualizado com sucesso',
                    data: updated
                };
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
                const comment = yield this.repo.findOneBy({ id });
                if (!comment) {
                    return {
                        message: 'Comentário não encontrado',
                        data: null
                    };
                }
                yield this.repo.delete(id);
                return {
                    message: 'Comentário deletado com sucesso',
                    data: null
                };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = CommentRepository;
