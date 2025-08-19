// src/modules/user/services/user.service.ts
import { CreateRoleDTO } from './schema/create-role.schema';
import { UpdateRoleDto } from './dto/update-role';
import { IRole } from './interfaces/role.interface';
import { RoleRepository } from './role.repository';

export class RoleService {
  private readonly roleRepository = new RoleRepository();

  async create(data: CreateRoleDTO): Promise<IRole> {
    try {
      const newData = {
        name: data.name.toLocaleLowerCase(),
        description: data.description.toLocaleLowerCase(),
      };
      return await this.roleRepository.create(newData);
    } catch (error) {
      console.error('Erro ao criar role:', error);
      throw error;
    }
  }

  async getAll(): Promise<IRole[]> {
    try {
      return await this.roleRepository.getAll();
    } catch (error) {
      console.error('Erro ao buscar todos roles:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IRole | null> {
    try {
      return await this.roleRepository.getById(id); // apenas retorna null se não encontrar
    } catch (error) {
      console.error(`Erro ao buscar role com id ${id}:`, error);
      throw error;
    }
  }

  async getByName(name: string): Promise<IRole | null> {
    try {
      return await this.roleRepository.getByName(name); // apenas retorna null se não encontrar
    } catch (error) {
      console.error(`Erro ao buscar role com name ${name}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateRoleDto): Promise<IRole | null> {
    try {
      await this.roleRepository.update(id, data);
      return await this.roleRepository.getById(id); // pode retornar null
    } catch (error) {
      console.error(`Erro ao atualizar role com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.roleRepository.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar role com id ${id}:`, error);
      throw error;
    }
  }
}
