// PostService.ts
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { IPost } from "./interfaces/post.interface";
import { IReturnResponse } from "./interfaces/response.interface";
import PostRepository from "./post.repository";

export default class PostService {
    private readonly postRepository = new PostRepository();

    async create(data: CreatePostDto): Promise<IPost | IReturnResponse> {
        try {
            const newData: CreatePostDto = {
                ...data,
                title: data.title.toLowerCase(),
                subtitle: data.subtitle.toLowerCase(),
                content: data.content.toLowerCase(),
                category_id: Number(data.category_id),
                user_id: Number(data.user_id),
            };
            const post = await this.postRepository.create(newData);
            return post;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAll(limit: number, page: number, query:string='', category: string = '', sort: string = ''): Promise<IReturnResponse> {
        try {
            const posts = await this.postRepository.getAll(limit, page, query, category, sort);
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTop(): Promise<IPost[] | IReturnResponse> {
        try {
            // Chamada otimizada para o repositório
            const posts = await this.postRepository.getTop();
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async allPostsByUser(userId: number): Promise<IPost[] | IReturnResponse> {
        try {
            const posts = await this.postRepository.allPostsByUser(userId);
            return posts;
        } catch (error) {
            console.error('Erro no serviço ao buscar posts do usuário:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<IReturnResponse | null> {
        try {
            const post = await this.postRepository.getById(id);
            return post;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Otimização: A responsabilidade de verificar a existência do post foi movida para o service/repository.
    // O controller não precisa mais fazer uma chamada `getById` antes de chamar o `update`.
    async update(id: number, updatePostDto: UpdatePostDto): Promise<IPost | IReturnResponse | null> {
        try {
            const newUpdatePostDto = {
                title: updatePostDto.title?.toLocaleLowerCase(),
                subtitle: updatePostDto.subtitle?.toLocaleLowerCase(),
                content: updatePostDto.content?.toLocaleLowerCase()
            };
            const updatedPost = await this.postRepository.update(id, newUpdatePostDto);
            return updatedPost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // A responsabilidade de verificar a existência do post foi movida para o service/repository.
    async delete(id: number): Promise<IPost | IReturnResponse | null> {
        try {
            const deletedPost = await this.postRepository.delete(id);
            return deletedPost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAllPostsByCategory(slug: string): Promise<IPost[] | null> {
        if (!slug || slug.trim() === '') return [];
        try {
            const posts = await this.postRepository.getAllPostsByCategory(slug);
            return posts.length > 0 ? posts : null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updatePostByUser(
        postId: number,
        userId: number,
        updatePostDto: UpdatePostDto
    ): Promise<IPost | false | null> {
        try {
            const post = await this.postRepository.getById(postId);
            console.log(postId)
            if (!post || !post.data) {
                return null; // Post não encontrado
            }

            const postUserId = Array.isArray(post.data)
                ? post.data[0]?.user_id
                : post.data.user_id;

            if (postUserId !== userId) {
                return false; // Acesso negado
            }

            // Monta objeto de update dinamicamente
            const newUpdatePostDto: any = {};

            if (updatePostDto.title) newUpdatePostDto.title = updatePostDto.title;
            if (updatePostDto.subtitle) newUpdatePostDto.subtitle = updatePostDto.subtitle;
            if (updatePostDto.content) newUpdatePostDto.content = updatePostDto.content;
            if (updatePostDto.image_url) newUpdatePostDto.image_url = updatePostDto.image_url;

            // Atualiza no repositório
            const updatedPost = await this.postRepository.update(postId, newUpdatePostDto);
            return updatedPost as IPost;
        } catch (error) {
            console.error("Erro no serviço ao atualizar post do usuário:", error);
            throw error;
        }
    }

    async deletePostByUser(postId: number, userId: number): Promise<IPost | false | null> {
        try {
            const post = await this.postRepository.getById(postId);
            if (!post || !post.data) {
                return null; // Post não encontrado
            }

            const postUserId = Array.isArray(post.data) ? post.data[0]?.user_id : post.data.user_id;

            if (postUserId !== userId) {
                return false; // Acesso negado
            }

            const deletedPost = await this.postRepository.delete(postId);
            return deletedPost as IPost;
        } catch (error) {
            console.error('Erro no serviço ao deletar post do usuário:', error);
            throw error;
        }
    }
}