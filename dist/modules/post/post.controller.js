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
const post_schema_1 = require("./schema/post.schema");
const validation_update_post_1 = require("./schema/validation-update-post");
class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const validation = post_schema_1.creatPostSchema.safeParse(data);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'validation failed',
                        errors: validation.error.flatten().fieldErrors,
                    });
                }
                const post = yield this.postService.create(data);
                return res.status(200).json({ post: post });
            }
            catch (error) {
                console.error('Erro interno ao tentar criar o post', error);
                if (error.message === 'Usuário não encontrado') {
                    return res.status(400).json({
                        message: 'Usuário informado não existe. Verifique o campo "user_id".',
                    });
                }
                if (error.code === '23503') {
                    return res.status(400).json({
                        message: 'Violação de chave estrangeira: usuário não existe.',
                    });
                }
                return res.status(500).json({ message: 'Erro interno ao tentar criar o post' });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = parseInt(req.query.limit) || 5;
            const page = parseInt(req.query.page) || 1;
            try {
                const posts = yield this.postService.getAll(limit, page);
                if (!posts)
                    return res.status(400).json({ message: 'Não existe postagens disponíveis' });
                return res.json({ message: 'posts: ', posts });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
            }
        });
    }
    getTop(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.postService.getTop();
                if (!posts)
                    return res.status(400).json({ message: 'Não existe postagens disponíveis' });
                return res.json({ message: 'posts: ', posts });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postService.getById(Number(req.params.id));
                if (!post)
                    return res.status(400).json({ message: 'Postagem com "ID" não existe' });
                return res.json({ message: 'postagens', post });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = req.body;
                const id = Number(req.params.id);
                // Verifica se o post existe
                const resultPost = yield this.postService.getById(id);
                if (!resultPost) {
                    return res.status(400).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });
                }
                // Valida os dados com Zod
                const validation = validation_update_post_1.validationSchemaUpdatePost.safeParse(newData);
                if (!validation.success) {
                    return res.status(400).json({
                        message: 'Falha de validação',
                        error: validation.error.flatten().fieldErrors
                    });
                }
                // Impede update vazio (sem campos enviados)
                if (Object.keys(validation.data).length === 0) {
                    return res.status(400).json({ message: 'Nenhum campo foi enviado para atualização.' });
                }
                // Executa o update
                const updatePost = yield this.postService.update(id, validation.data);
                return res.json({ message: 'Atualização realizada com sucesso.', updatePost });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Erro interno no servidor.' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const resultPost = yield this.postService.getById(id);
                if (!resultPost)
                    return res.status(400).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });
                const post = yield this.postService.delete(id);
                return res.json({ message: 'Postagem deletada com sucesso', post });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = PostController;
