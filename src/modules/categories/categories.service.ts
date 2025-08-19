import { CategoryRepository } from './categories.repository';
import { ICategory } from './interfaces/categories-interface';

export class CategoryService {
  constructor(private categoryRepo = new CategoryRepository()) {}

  async create(data: Partial<ICategory>): Promise<ICategory> {
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Nome da categoria é obrigatório e deve ter pelo menos 3 caracteres');
    }
    return this.categoryRepo.create(data);
  }

  async getAll(): Promise<ICategory[]> {
    return this.categoryRepo.findAll();
  }

  async getById(id: number): Promise<ICategory | null> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID inválido');
    }
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      return null; 
    }
    return category;
  }

  async update(id: number, data: Partial<ICategory>): Promise<ICategory | null> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID inválido');
    }

    if (data.name && data.name.trim().length < 3) {
      throw new Error('Nome da categoria deve ter pelo menos 3 caracteres');
    }


    const updated = await this.categoryRepo.update(id, data);
    return updated; 
  }

  async delete(id: number): Promise<boolean> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('ID inválido');
    }
    return this.categoryRepo.delete(id);
  }
}
