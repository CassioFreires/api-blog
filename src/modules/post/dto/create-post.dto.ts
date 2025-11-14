export class CreatePostDto {
  id?: number;
  title?: string; // usado para post padrão
  subtitle?: string;
  category_id?: number;
  content?: string;
  image_url?: string;
  user_id!: number;

  // Campos para enquete
  postType!: 'standard' | 'poll';
  question?: string; // título da enquete
  options?: string[]; // opções da enquete
}