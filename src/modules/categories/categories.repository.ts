import db from '../../config/ps.config';
import { ICategory } from './interfaces/categories-interface';
import { Knex } from 'knex';

export class CategoryRepository {
  private tableName = 'categories';

  // Recebe opcionalmente a transação para operações compostas
  async create(data: Partial<ICategory>, trx?: Knex.Transaction): Promise<ICategory> {
    try {
      const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
      const [createdCategory] = await queryBuilder
        .insert(data)
        .returning('*');
      return createdCategory;
    } catch (error) {
      throw error;
    }
  }

  async findAll(trx?: Knex.Transaction): Promise<ICategory[]> {
    try {
      const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
      return await queryBuilder.select('*');
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  async findById(id: number, trx?: Knex.Transaction): Promise<ICategory | null> {
    try {
      const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
      const category = await queryBuilder.where({ id }).first();
      return category || null;
    } catch (error) {
      console.error(`Erro ao buscar categoria com id ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, data: Partial<ICategory>, trx?: Knex.Transaction): Promise<ICategory | null> {
    try {
      const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
      const updatedRows = await queryBuilder
        .where({ id })
        .update(data)
        .returning('*');
      if (updatedRows.length === 0) return null;
      return updatedRows[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number, trx?: Knex.Transaction): Promise<boolean> {
    try {
      const queryBuilder = trx ? trx(this.tableName) : db(this.tableName);
      const deletedRows = await queryBuilder.where({ id }).del();
      return deletedRows > 0;
    } catch (error) {
      console.error(`Erro ao deletar categoria com id ${id}:`, error);
      throw error;
    }
  }
}
