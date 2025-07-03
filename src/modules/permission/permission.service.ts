// src/modules/user/services/user.service.ts
import { CreatePermission } from './dto/create-permission.dto';
import { UpdatePermission } from './dto/update-permission.dto';
import { IPermission } from './interfaces/permission.interface';
import { PermissionRepository } from './permission.repository';

export class PermissionService {
  private readonly permissionRepository = new PermissionRepository();

  async create(data: CreatePermission): Promise<IPermission> {
    try {
      const newData = {
        name: data.name.toLocaleLowerCase(),
        description: data.description.toLocaleLowerCase(),
      };
      return await this.permissionRepository.create(newData);
    } catch (error) {
      console.error('Erro ao criar permission:', error);
      throw error;
    }
  }

  async getAll(): Promise<IPermission[]> {
    try {
      return await this.permissionRepository.getAll();
    } catch (error) {
      console.error('Erro ao buscar todos roles:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IPermission | null> {
    try {
      return await this.permissionRepository.getById(id); // apenas retorna null se não encontrar
    } catch (error) {
      console.error(`Erro ao buscar permission com id ${id}:`, error);
      throw error;
    }
  }

  async getByName(name: string): Promise<IPermission | null> {
    try {
      return await this.permissionRepository.getByName(name); // apenas retorna null se não encontrar
    } catch (error) {
      console.error(`Erro ao buscar permission com name ${name}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdatePermission): Promise<IPermission | null> {
    try {
      await this.permissionRepository.update(id, data);
      return await this.permissionRepository.getById(id); // pode retornar null
    } catch (error) {
      console.error(`Erro ao atualizar permission com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.permissionRepository.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar permission com id ${id}:`, error);
      throw error;
    }
  }

  async findByIds(ids: number[]): Promise<IPermission[]> {
    try {
      return await this.permissionRepository.findByIds(ids);
    } catch (error) {
      console.error('Erro ao buscar permissões pelos IDs no service:', error);
      throw error;
    }
  }

}
