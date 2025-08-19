export interface ICategory {
  id: number;
  name: string;
  slug: string;
  createdAt: string;  // ou Date, dependendo de como vem do backend
  updatedAt: string;  // idem
  deletedAt?: string | null; // se usar soft delete
}
