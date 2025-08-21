import { Request, Response } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { IPost } from "./interfaces/post.interface";
import { creatPostSchema } from "./schema/post.schema";
import PostService from "./post.service";
import { IReturnResponse } from "./interfaces/response.interface";
import { UpdatePostDto } from "./dto/update-post.dto";
import { validationSchemaUpdatePost } from "./schema/validation-update-post";
import { UserService } from "../user/user.service";

export default class PostController {
    private readonly userService = new UserService();
    private readonly postService = new PostService();

    async create(req: Request, res: Response): Promise<Response<IPost | IReturnResponse>> {
        try {
            const data: CreatePostDto = req.body;

            const validation = creatPostSchema.safeParse(data);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'validation failed',
                    errors: validation.error.flatten().fieldErrors,
                })
            }

            const post = await this.postService.create(data)
            return res.status(200).json({ post: post })
        } catch (error: any) {
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

    }

    async getAll(req: Request, res: Response): Promise<Response<IReturnResponse>> {
        const limit = parseInt(req.query.limit as string) || 5;
        const page = parseInt(req.query.page as string) || 1;

        try {
            const posts = await this.postService.getAll(limit, page);
            if (!posts) return res.status(400).json({ message: 'Não existe postagens disponíveis' })
            return res.json({ message: 'posts: ', posts });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
        }
    }

    async getTop(req: Request, res: Response): Promise<Response<IPost[] | IReturnResponse>> {
        try {
            const posts = await this.postService.getTop();
            if (!posts) return res.status(400).json({ message: 'Não existe postagens disponíveis' })
            return res.json({ message: 'posts: ', posts });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno ao tentar obter os posts' });
        }
    }


    async getById(req: Request, res: Response): Promise<Response<IPost | IReturnResponse | null>> {
        try {
            const post = await this.postService.getById(Number(req.params.id));
            if (!post) return res.status(400).json({ message: 'Postagem com "ID" não existe' });
            return res.json({ message: 'postagens', post });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(req: Request, res: Response): Promise<Response<IPost | IReturnResponse | null>> {
        try {
            const newData: UpdatePostDto = req.body;
            const id = Number(req.params.id);

            console.log(id)

            // Verifica se o post existe
            const resultPost = await this.postService.getById(id);
            if (!resultPost) {
                return res.status(400).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });
            }

            // Valida os dados com Zod
            const validation = validationSchemaUpdatePost.safeParse(newData);
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
            const updatePost = await this.postService.update(id, validation.data);

            return res.json({ message: 'Atualização realizada com sucesso.', updatePost });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response<IPost | IReturnResponse | null>> {
        try {
            const id = Number(req.params.id);
            const resultPost = await this.postService.getById(id);
            if (!resultPost) return res.status(400).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });

            const post = await this.postService.delete(id);
            return res.json({ message: 'Postagem deletada com sucesso', post });

        } catch (error) {
            console.log(error);
            throw error;
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

            return res.json({ message: 'Posts encontrados', posts });
        } catch (error: any) {
            // Captura o erro de tipo inválido do PostgreSQL
            if (error.code === '22P02') {
                console.error('Erro de tipo inválido: parâmetro não numérico enviado para integer.');
                return res.status(400).json({ message: 'Parâmetro inválido enviado para a query' });
            }

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
            const newData: UpdatePostDto = req.body;
            const {id} = newData;
            const idPost = Number(id);
            const userIdAuthenticated = Number(req.user?.user.id);

            const resultPost = await this.postService.getById(Number(idPost));
            if (!resultPost) {
                return res.status(400).json({ message: 'Não existe postagem com o "ID" passado por parâmetro.' });
            }

            // Verifica se resultPost.data é um array ou um post único
            if (!resultPost.data) {
                return res.status(404).json({ message: "Post não encontrado." });
            }

            let postUserId: number | undefined;

            if (Array.isArray(resultPost.data)) {
                postUserId = resultPost.data[0]?.user_id;
            } else {
                postUserId = resultPost.data.user_id;
            } 

            // Valida se o usuário logado é o dono do post
            if (postUserId !== userIdAuthenticated) {
                return res.status(403).json({ message: "Você só pode alterar seus próprios posts." });
            }


            // Valida os dados com Zod
            const validation = validationSchemaUpdatePost.safeParse(newData);
            if (!validation.success) {
                return res.status(400).json({
                    message: 'Falha de validação',
                    error: validation.error.flatten().fieldErrors
                });
            }

            if (Object.keys(validation.data).length === 0) {
                return res.status(400).json({ message: 'Nenhum campo foi enviado para atualização.' });
            }

            const updatePost = await this.postService.update(Number(id), validation.data);

            return res.json({ message: 'Atualização realizada com sucesso.', updatePost });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }


}