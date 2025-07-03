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
const validation_like_schema_1 = require("./schema/validation-like.schema");
class LikeController {
    constructor(likeService) {
        this.likeService = likeService;
    }
    toggle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, post_id } = req.body;
                const validation = validation_like_schema_1.validationLikeSchema.safeParse({ user_id, post_id });
                if (!validation.success) {
                    return res.status(400).json({
                        message: "Falha na validação",
                        error: validation.error.flatten().fieldErrors,
                    });
                }
                const result = yield this.likeService.toggle(validation.data);
                return res.status(200).json(result);
            }
            catch (error) {
                console.log(error.code);
                if (error.code == "23503") {
                    return res.status(400).json({
                        message: "Usuário ou post informado não existe no sistema.",
                        error: error.detail || "Chave estrangeira inválida"
                    });
                }
                console.error("[LikeController][toggle]", error);
                return res.status(500).json({
                    message: "Erro interno ao processar like",
                    error,
                });
            }
        });
    }
    countByPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post_id = Number(req.params.post_id);
                if (isNaN(post_id)) {
                    return res.status(400).json({
                        message: "ID do post inválido",
                    });
                }
                const result = yield this.likeService.countByPost(post_id);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error("[LikeController][countByPost]", error);
                return res.status(500).json({
                    message: "Erro interno ao contar curtidas",
                    error,
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.likeService.getAll();
                if (!result.data || result.data.length === 0) {
                    return res.status(404).json({
                        message: 'Não existe nenhum like registrado',
                        data: [],
                    });
                }
                return res.json(result); // ✔ Já está no formato IReturnResponse<ILike[]>
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar buscar todas as curtidas',
                    error,
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const result = yield this.likeService.getById(id);
                console.log(result);
                if (!result.data || !result || result.data == null) {
                    return res.status(404).json({
                        message: 'Não existe nenhum like registrado',
                        data: [],
                    });
                }
                return res.json(result); // ✔ Já está no formato IReturnResponse<ILike>
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar buscar o like através do "ID"',
                    error,
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const exists = yield this.likeService.getById(id);
                if (exists.data == null || !exists.data)
                    return res.status(400).json({ message: `Like com "ID = ${id}" não existe!` });
                yield this.likeService.delete(id);
                return res.json({ message: `Like com "ID = ${id}" deletado com sucesso!` });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: 'Erro interno ao tentar deletar o like.'
                });
            }
        });
    }
}
exports.default = LikeController;
