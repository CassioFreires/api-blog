import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { Request } from 'express';
import { createMockResponse } from '../../../../shared/test/mocks';

// Mock de um usuário
const mockUser = {
  id: 1,
  name: 'cassio',
  fullName: 'Cassio Leopoldo Freires Souza',
  email: 'cassio_souza@live.com',
  password_hash: '123456',
};

// Agrupa os testes da classe UserController
describe('UserController', () => {
  // Cria um mock do service com jest.fn()
  const mockService = {
    create: jest.fn().mockResolvedValue(mockUser),
    getAll: jest.fn().mockResolvedValue([mockUser]),
    getById: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(undefined),
  } as unknown as UserService;

  // Cria o controller passando o mock do service
  const controller = new UserController(mockService);

  // Cria um mock da requisição
  const mockReq = {
    body: mockUser,
    params: { id: '1' },
  } as unknown as Request;

  it('create() - deve retornar 201 e o usuário criado', async () => {
    const res = createMockResponse();
    await controller.create(mockReq, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created', data: mockUser });
  });

  it('getAll() - deve retornar 200 e todos os usuários', async () => {
    const res = createMockResponse();
    await controller.getAll(mockReq, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Users fetched', data: [mockUser] });
  });

  it('getById() - deve retornar 200 e o usuário correspondente', async () => {
    const res = createMockResponse();
    await controller.getById(mockReq, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User fetched', data: mockUser });
  });

  it('update() - deve retornar 200 e o usuário atualizado', async () => {
    const res = createMockResponse();
    await controller.update(mockReq, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User updated', data: mockUser });
  });

  it('delete() - deve retornar 200 e null', async () => {
    const res = createMockResponse();
    await controller.delete(mockReq, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted', data: null });
  });
});
