import { Request, Response } from 'express';
import { CategoryService } from './categories.service';
import { createCategorySchema } from './schema/validation-create-categories';
import { updateCategorySchema } from './schema/validation-update-categories';
import { ZodError } from 'zod';

export default class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async create(req: Request, res: Response) {
    try {
      // Validação do corpo da requisição
      createCategorySchema.parse(req.body);

      const category = await this.categoryService.create(req.body);
      return res.status(201).json(category);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Erro na validação dos dados',
          errors: error.errors,
        });
      }

      // Tratamento para categoria já existente
      if (error.code === '23505' || error.message?.includes('já existe')) {
        return res.status(409).json({ message: 'Categoria já existe' });
      }
      return res.status(500).json({ message: 'Erro ao criar categoria' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAll();
      return res.status(200).json(categories);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message || 'Erro ao buscar categorias' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

      const category = await this.categoryService.getById(id);
      if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });

      return res.status(200).json(category);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message || 'Erro ao buscar categoria' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

      updateCategorySchema.parse(req.body);

      const updated = await this.categoryService.update(id, req.body);
      if (!updated) return res.status(404).json({ message: 'Categoria não encontrada' });

      return res.status(200).json(updated);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Erro na validação dos dados',
          errors: error.errors,
        });
      }

      if (error.code === '42703') {
        return res.status(400).json({
          message: 'Campo inválido: um ou mais campos enviados não existem na tabela.',
        });
      }
      return res.status(500).json({ message: error.message || 'Erro ao atualizar categoria' });
    }
  }


  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

      const deleted = await this.categoryService.delete(id);
      if (!deleted) return res.status(404).json({ message: 'Categoria não encontrada' });

      return res.status(204).send({ message: 'Categoria deletada com sucesso' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Erro ao deletar categoria' });
    }
  }
}
