import { RoleEntity } from "./entities/role.entities";
import { CreateRoleDTO } from "./schema/create-role.schema";
import { UpdateRoleDto } from "./dto/update-role";
import PsDatabase from "../../config/ps.config";
import { Repository } from "typeorm";
import { IRole } from "./interfaces/Role.interface";

export class RoleRepository {
  private repo: Repository<RoleEntity>;

  constructor() {
    this.repo = PsDatabase.getRepository(RoleEntity);
  }

  async create(data: CreateRoleDTO): Promise<IRole> {
    try {
      const role = this.repo.create(data); // cria instância com dados do DTO
      return await this.repo.save(role);   // salva no banco
    } catch (error) {
      console.error('Erro ao criar role no repositório:', error);
      throw error;
    }
  }

  async getAll(): Promise<IRole[]> {
    try {
      return await this.repo.find();
    } catch (error) {
      console.error('Erro ao buscar todos roles no repositório:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IRole | null> {
    try {
      return await this.repo.findOneBy({ id });
    } catch (error) {
      console.error(`Erro ao buscar role com id ${id} no repositório:`, error);
      throw error;
    }
  }

  async getByName(name: string): Promise<IRole | null> {
    try {
      return await this.repo.findOneBy({ name });
    } catch (error) {
      console.error(`Erro ao buscar role name id ${name} no repositório:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateRoleDto): Promise<IRole | null> {
    try {
      await this.repo.update(id, data);
      const updateRole = await this.getById(id);
      return updateRole ?? null;
    } catch (error) {
      console.error(`Erro ao atualizar role com id ${id} no repositório:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar role com id ${id} no repositório:`, error);
      throw error;
    }
  }
}
