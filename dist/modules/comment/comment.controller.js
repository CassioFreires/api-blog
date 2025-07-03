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
Object.defineProperty(exports, "__esModule", { value: true });
const validation_comment_schema_1 = require("./schema/validation.comment.schema");
const validation_update_comment_1 = require("./schema/validation-update.comment");
class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const validation = validation_comment_schema_1.validationCommentSchema.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Dados inválidos',
                    error: validation.error.flatten().fieldErrors
                });
            }
            try {
                const comment = yield this.commentService.create(validation.data);
                if (comment.data == null || !comment.data) {
                    return res.status(400).json({
                        message: "Usuário ou Post não encontrados",
                        error: "IDs inválidos"
                    });
                }
                return res.status(200).json({
                    message: 'Comentário criado com sucesso',
                    comment
                });
            }
            catch (error) {
                return res.status(500).json({
                    message: 'Erro interno ao tentar criar comentário!',
                    error
                });
            }
        });
    }
    getAllCommentByPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post_id = req.params.post_id;
                const result = yield this.commentService.getAllCommentsByPost(Number(post_id));
                return res.json({
                    data: result
                });
            }
            catch (error) {
                if (error.code == '22P02') {
                    return res.status(500).json({
                        message: 'Não foi enviado o parametro de entradada "post_id" no body'
                    });
                }
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar contar os comentarios do post'
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.commentService.getAll();
                if (!comment) {
                    return res.status(400).json({
                        message: 'Não existem comentarios',
                    });
                }
                return res.json({ data: comment });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao buscar todos os comentarios',
                    error,
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const comment = yield this.commentService.getById(id);
                if (!comment.data || comment.data == null) {
                    return res.status(400).json({
                        message: 'Não existe comentario com o "ID" passado por parametro'
                    });
                }
                return res.json({
                    comment
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: `Erro interno ao tentar localizar comentario através do "ID"`
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const validation = validation_update_comment_1.validationCommentUpdateSchema.safeParse(data);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Failed validation',
                        error: validation.error.flatten().fieldErrors
                    });
                }
                if (!(data === null || data === void 0 ? void 0 : data.content)) {
                    return res.status(400).json({
                        message: 'Campo "content" é obrigatório.'
                    });
                }
                const commentExist = yield this.commentService.getById(id);
                if (!commentExist.data) {
                    return res.status(404).json({
                        message: 'Comentário não encontrado.'
                    });
                }
                const updatedComment = yield this.commentService.update(id, data);
                return res.json(updatedComment);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao atualizar o comentário.'
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({
                        message: 'Parâmetro "id" inválido'
                    });
                }
                const deleted = yield this.commentService.delete(id);
                if (!deleted.data) {
                    return res.status(404).json({
                        message: deleted.message
                    });
                }
                return res.status(200).json(deleted);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar deletar o comentário'
                });
            }
        });
    }
}
exports.default = CommentController;
