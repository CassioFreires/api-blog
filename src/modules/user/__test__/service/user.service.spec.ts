// src/modules/user/__test__/service/user.service.spec.ts
import { UserService } from '../../user.service';
import { UserRepository } from '../../user.repository';

const mockUser = {
  id: 1,
  name: 'cassio',
  lastName: 'cassio leopoldo freires souza',
  email: 'cassio_souza@live.com',
  password_hash: '123456'
};

describe('UserService', () => {
  // Criar um mock para o UserRepository
  const mockRepository = {
    create: jest.fn().mockResolvedValue(mockUser),
    getAll: jest.fn().mockResolvedValue([mockUser]),
    getById: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  // Instancia o service, injetando o mock do repositório
  const service = new UserService();

  // Substitui o userRepository real pelo mock no service
  // @ts-ignore
  service.userRepository = mockRepository;

  it('create() - deve criar e retornar usuário com dados normalizados', async () => {
    const newData = {
      name: 'CASSIO', // será convertido para minúsculo no service
      lastName: 'CASSIO LEOPOLDO FREIRES SOUZA',
      email: 'CASSIO_SOUZA@LIVE.COM',
      password_hash: '123456',
    };

    const result = await service.create(newData);

    // Verifica se o create do repositório foi chamado com os dados em lowercase
    expect(mockRepository.create).toHaveBeenCalledWith({
      name: 'cassio',
      lastName: 'cassio leopoldo freires souza',
      email: 'cassio_souza@live.com',
      password_hash: '123456',
    });

    // Verifica se o resultado é o usuário mockado
    expect(result).toEqual(mockUser);
  });

  it('getAll() - deve retornar todos usuários', async () => {
    const result = await service.getAll();

    expect(mockRepository.getAll).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('getById() - deve retornar usuário pelo id', async () => {
    const result = await service.getById(1);

    expect(mockRepository.getById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockUser);
  });

  it('update() - deve atualizar usuário', async () => {
    const updateData = { lastName: 'Novo Nome' };
    const result = await service.update(1, updateData);

    expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result).toEqual(mockUser);
  });

  it('delete() - deve chamar delete do repositório', async () => {
    await service.delete(1);

    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });
});
