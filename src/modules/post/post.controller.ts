import { Request, Response } from "express";
import { CreatePostDto } from "./dto/create-post.dto";
import { IPost } from "./interfaces/post.interface";
import { creatPostSchema } from "./schema/post.schema";
import PostService from "./post.service";
import { IReturnResponse } from "./interfaces/response.interface";
import { UpdatePostDto } from "./dto/update-post.dto";
import { validationSchemaUpdatePost } from "./schema/validation-update-post";

export default class PostController {
    constructor(private readonly postService: PostService) { }

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

    async getAll(req: Request, res: Response): Promise<Response<IPost[] | IReturnResponse>> {
        try {
            const posts = await this.postService.getAll();
            if (!posts) return res.status(400).json({ message: 'Não existe postagens disponíveis' })
            return res.json({ message: 'posts: ', date: posts });
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
            if(!resultPost) return res.status(400).json({message: 'Não existe postagem com o "ID" passado por parâmetro.'});

            const post = await this.postService.delete(id);
            return res.json({message: 'Postagem deletada com sucesso', post});
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}