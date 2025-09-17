import { Request, Response } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { IPost } from "./interfaces/post.interface";
import { creatPostSchema } from "./schema/post.schema";
import PostService from "./post.service";
import { IReturnResponse } from "./interfaces/response.interface";
import { UpdatePostDto } from "./dto/update-post.dto";
import { validationSchemaUpdatePost } from "./schema/validation-update-post";
import path from "path";
import fs from 'fs';
import fsCallback from "fs/promises";

export default class PostController {
    private readonly postService = new PostService();

    async create(req: Request, res: Response): Promise<Response<IPost | IReturnResponse>> {
        try {
            const data: CreatePostDto = req.body;
            const validation = creatPostSchema.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Falha na validação',
                    errors: validation.error.flatten().fieldErrors,
                });
            }

            const post = await this.postService.create(data);
            return res.status(201).json({ post: post });
        } catch (error: any) {
            console.error('Erro interno ao tentar criar o post', error);
            // Captura o erro de chave estrangeira diretamente do repositório
            if (error.code === '23503') {
                return res.status(400).json({
                    message: 'Violação de chave estrangeira: usuário ou categoria não existem.',
                });
            }
            return res.status(500).json({ message: 'Erro interno ao tentar criar o post' });
        }
    }

    async getAll(req: Request, res: Response): Promise<Response<IReturnResponse>> {
        const limit = parseInt(req.query.limit as string) || 5;
        const page = parseInt(req.query.page as string) || 1;
        try {
            const posts = await this.postService.getAll(limit, page);
            if (!posts.data || (Array.isArray(posts.data) && posts.data.length === 0)) {
                return res.status(404).json({ message: 'Não existe postagens disponíveis' });
            }
            return res.status(200).json(posts);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
        }
    }

    async getTop(req: Request, res: Response): Promise<Response<IPost[] | IReturnResponse>> {
        try {
            const posts = await this.postService.getTop();
            if (!posts || (Array.isArray(posts) && posts.length === 0)) {
                return res.status(404).json({ message: 'Não existem postagens disponíveis' });
            }
            return res.status(200).json({ message: 'posts: ', posts });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
        }
    }

    async getById(req: Request, res: Response): Promise<Response<IPost | IReturnResponse | null>> {
        try {
            const post = await this.postService.getById(Number(req.params.id));
            if (!post) {
                return res.status(404).json({ message: 'Postagem com "ID" não existe' });
            }
            return res.status(200).json({ message: 'postagem', post });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    async update(req: Request, res: Response): Promise<Response<IPost | IReturnResponse | null>> {
        try {
            const newData: UpdatePostDto = req.body;
            const id = Number(req.params.id);

            // Validação com Zod
            const validation = validationSchemaUpdatePost.safeParse(newData);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Falha de validação',
                    error: validation.error.flatten().fieldErrors
                });
            }

            // Impede update vazio
            if (Object.keys(validation.data).length === 0) {
                return res.status(400).json({ message: 'Nenhum campo foi enviado para atualização.' });
            }

            // A chamada ao service já faz a busca e o update em uma única operação
            const updatedPost = await this.postService.update(id, validation.data);

            if (!updatedPost) {
                return res.status(404).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });
            }

            return res.status(200).json({ message: 'Atualização realizada com sucesso.', updatedPost });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response<IPost | IReturnResponse | null>> {
        try {
            const id = Number(req.params.id);
            const deletedPost = await this.postService.delete(id);
            if (!deletedPost) {
                return res.status(404).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });
            }
            return res.status(200).json({ message: 'Postagem deletada com sucesso', post: deletedPost });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    async getAllPostsByCategory(req: Request, res: Response): Promise<Response> {
        const { slug } = req.params;

        if (!slug || slug.trim() === '') {
            return res.status(400).json({ message: 'Slug da categoria é obrigatório' });
        }
        try {
            const posts = await this.postService.getAllPostsByCategory(slug);
            if (!posts || posts.length === 0) {
                return res.status(404).json({ message: 'Não existem postagens disponíveis para esta categoria' });
            }
            return res.status(200).json({ message: 'Posts encontrados', posts });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
        }
    }

    async allPostsByUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.user?.user.id);
            if (!userId) {
                return res.status(401).json({ message: 'Usuário não autenticado.' });
            }
            const posts = await this.postService.allPostsByUser(userId);
            if (!posts || (Array.isArray(posts) && posts.length === 0)) {
                return res.status(404).json({ message: 'Nenhum post encontrado para este usuário.' });
            }
            return res.status(200).json({
                message: "Posts encontrados com sucesso.",
                data: posts
            });
        } catch (error) {
            console.error('Erro interno no servidor ao tentar obter os posts do usuário:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    async updatePostByUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const postId = Number(id);
            const userIdAuthenticated = Number(req.user?.user.id);

            const existingPostResponse: any = await this.postService.getById(postId);
            const existingPost = existingPostResponse.data;

            if (!existingPost) {
                return res.status(404).json({ message: "Post não encontrado." });
            }

            // Se chegou imagem nova
            let newData: UpdatePostDto = req.body;
            if (req.file) {
                // deleta imagem antiga se existir
                if (existingPost.image_url) {
                    const oldPath = path.join(process.cwd(), existingPost.image_url);
                    fs.unlink(oldPath, (err) => {
                        if (err) return console.warn("Erro ao deletar imagem antiga:", err);
                        console.log("Imagem antiga deletada com sucesso!");
                    });
                }
                newData.image_url = `/uploads/imgPosts/${req.file.filename}`;
            }

            const updatedPost = await this.postService.updatePostByUser(postId, userIdAuthenticated, newData);

            return res.status(200).json({ message: "Atualizado com sucesso", updatePost: updatedPost });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor" });
        }
    }

    async deletePostByUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const postId = Number(id);
            const userIdAuthenticated = Number(req.user?.user.id);

            // Pega o post antes de deletar
            const existingPostResponse: any = await this.postService.getById(postId);
            const existingPost = existingPostResponse.data;

            if (!existingPost) {
                return res.status(404).json({ message: "Post não encontrado." });
            }

            if (existingPost.user_id !== userIdAuthenticated) {
                return res.status(403).json({ message: "Você só pode deletar seus próprios posts." });
            }

            // Deleta a imagem do servidor se existir
            if (existingPost.image_url) {
                const imagePath = path.join(process.cwd(), existingPost.image_url);

                try {
                    await fsCallback.access(imagePath); // verifica se o arquivo existe
                    await fsCallback.unlink(imagePath); // deleta o arquivo
                    console.log("Imagem deletada com sucesso:", imagePath);
                } catch {
                    // Se o arquivo não existe ou erro, não impede a deleção do post
                    console.warn("Imagem não encontrada ou erro ao deletar:", existingPost.image_url);
                }
            }

            // Deleta o post do banco
            await this.postService.deletePostByUser(postId, userIdAuthenticated);

            return res.status(200).json({ message: "Post deletado com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    }

    async createPostByUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.user?.user.id);
            if (!userId) {
                return res.status(401).json({ message: "Usuário não autenticado." });
            }

            const rawData = {
                ...req.body,
                category_id: Number(req.body.category_id),
            };

            const validation = creatPostSchema.safeParse(rawData);
            if (!validation.success) {
                return res.status(400).json({
                    message: "Falha de validação",
                    errors: validation.error.flatten().fieldErrors,
                });
            }

            const postData: CreatePostDto = { ...validation.data, user_id: userId };

            // Se houver arquivo de imagem
            if (req.file) {
                postData.image_url = `/uploads/imgPosts/${req.file.filename}`;
            }

            const post = await this.postService.create(postData);

            return res.status(201).json({ post });
        } catch (error: any) {
            console.error(error);
            if (error.code === "23503") {
                return res.status(400).json({
                    message: "Usuário ou categoria não existem. Violação de chave estrangeira.",
                });
            }
            return res.status(500).json({ message: "Erro interno ao tentar criar o post." });
        }
    }
}