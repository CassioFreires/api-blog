import { PermissionEntity } from "./entities/permission.entitie";
import { CreatePermission } from "./dto/create-permission.dto";
import { UpdatePermission } from "./dto/update-permission.dto";
import PsDatabase from "../../config/ps.config";
import { Repository } from "typeorm";
import { IPermission } from "./interfaces/permission.interface";

export class PermissionRepository {
  private repo: Repository<PermissionEntity>;

  constructor() {
    this.repo = PsDatabase.getRepository(PermissionEntity);
  }

  async create(data: CreatePermission): Promise<IPermission> {
    try {
      const permission = this.repo.create(data); // cria instância com dados do DTO
      return await this.repo.save(permission);   // salva no banco
    } catch (error) {
      console.error('Erro ao criar permission no repositório:', error);
      throw error;
    }
  }

  async getAll(): Promise<IPermission[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      console.error('Erro ao buscar todos permission no repositório:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IPermission | null> {
    try {
      return await this.repo.findOneBy({ id });
    } catch (error) {
      console.error(`Erro ao buscar permission com id ${id} no repositório:`, error);
      throw error;
    }
  }

  async getByName(name: string): Promise<IPermission | null> {
    try {
      return await this.repo.findOneBy({ name });
    } catch (error) {
      console.error(`Erro ao buscar permission name id ${name} no repositório:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdatePermission): Promise<IPermission | null> {
    try {
      await this.repo.update(id, data);
      const updatePermission = await this.getById(id);
      return updatePermission ?? null;
    } catch (error) {
      console.error(`Erro ao atualizar permission com id ${id} no repositório:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar permission com id ${id} no repositório:`, error);
      throw error;
    }
  }


  async findByIds(ids: number[]): Promise<IPermission[]> {
    try {
      return await this.repo.findByIds(ids);
    } catch (error) {
      console.error('Erro ao buscar permissões pelos IDs:', error);
      throw error;
    }
  }

}
