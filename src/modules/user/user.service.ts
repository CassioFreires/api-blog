// src/modules/user/services/user.service.ts
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user';
import { IUser } from './interfaces/user.interface';
import { UserRepository } from './user.repository';
import { hashPassword } from './utils/hashPassword';

export class UserService {
  private readonly userRepository = new UserRepository();

  async create(data: CreateUserDTO): Promise<IUser> {
    try {
      const hashedPassword = await hashPassword(data.password_hash);
      const newData = {
        name: data.name.toLocaleLowerCase(),
        fullName: data.fullName.toLocaleLowerCase(),
        email: data.email.toLocaleLowerCase(),
        password_hash: hashedPassword,
        bio: data?.bio,
        avatarUrl: data?.avatarUrl,
        role_id: data.role_id
      };
      return await this.userRepository.create(newData);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      return await this.userRepository.getAll();
    } catch (error) {
      console.error('Erro ao buscar todos usuários:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<IUser | null> {
    try {
      return await this.userRepository.getById(id); // apenas retorna null se não encontrar
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userRepository.getByEmail(email); // apenas retorna null se não encontrar
    } catch (error) {
      console.error(`Erro ao buscar usuário com email ${email}:`, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDTO): Promise<IUser | null> {
    try {
      await this.userRepository.update(id, data);
      return await this.userRepository.getById(id); // pode retornar null
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      console.error(`Erro ao deletar usuário com id ${id}:`, error);
      throw error;
    }
  }
}
