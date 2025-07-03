import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user";
import PsDatabase from "../../config/ps.config";
import { Repository } from "typeorm";
import { IUser } from "./interfaces/user.interface";
import UserEntity from "./entities/user.entities";
import { RoleEntity } from "../role/entities/role.entities";

export class UserRepository {
  private repo: Repository<UserEntity>;

  constructor() {
    this.repo = PsDatabase.getRepository(UserEntity);
  }

  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      const user = this.repo.create(data); // cria instância com dados do DTO
      return await this.repo.save(user);   // salva no banco
    } catch (error) {
      console.error('Erro ao criar usuário no repositório:', error);
      throw error;
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      return await this.repo.find({
        relations: ['role']
      });
    } catch (error) {
      console.error('Erro ao buscar todos usuários no repositório:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IUser | null> {
    try {
      return await this.repo.findOne({
        where: { id },
        relations: ['role']
      });
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id} no repositório:`, error);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.repo.findOne({
        where: { email },
        relations: ['role']
      });
    } catch (error) {
      console.error(`Erro ao buscar usuário email id ${email} no repositório:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDTO): Promise<IUser | null> {
    try {
      await this.repo.update(id, data);
      const updatedUser = await this.getById(id);
      return updatedUser ?? null;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id} no repositório:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar usuário com id ${id} no repositório:`, error);
      throw error;
    }
  }
}
