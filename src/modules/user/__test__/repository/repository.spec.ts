import { UserRepository } from "../../user.repository";
import UserEntity from "../../entities/user.entities";
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import PsDatabase from "../../../../config/ps.config";

describe('UserRepository', () => {
  let repo: UserRepository;
  let mockTypeOrmRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(() => {
    // Criação do mock dos métodos do TypeORM Repository
    mockTypeOrmRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    // Espiona o default export (PsDatabase) e mocka getRepository()
    jest.spyOn(PsDatabase, 'getRepository').mockReturnValue(mockTypeOrmRepo);

    // Instancia a classe e substitui o repo interno
    repo = new UserRepository();
    (repo as any).repo = mockTypeOrmRepo;
  });

  it('create() - deve criar e salvar um usuário', async () => {
    const data = { name: 'cassio', lastName: 'Cassio Souza', email: 'cassio@teste.com', password_hash: '123456' };
    const userEntity = new UserEntity();

    mockTypeOrmRepo.create.mockReturnValue(userEntity);
    mockTypeOrmRepo.save.mockResolvedValue(userEntity);

    const result = await repo.create(data);

    expect(mockTypeOrmRepo.create).toHaveBeenCalledWith(data);
    expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(userEntity);
    expect(result).toBe(userEntity);
  });

  it('getAll() - deve retornar todos os usuários', async () => {
    const users = [new UserEntity(), new UserEntity()];
    mockTypeOrmRepo.find.mockResolvedValue(users);

    const result = await repo.getAll();

    expect(mockTypeOrmRepo.find).toHaveBeenCalled();
    expect(result).toBe(users);
  });

  it('getById() - deve retornar usuário pelo id', async () => {
    const user = new UserEntity();
    mockTypeOrmRepo.findOneBy.mockResolvedValue(user);

    const result = await repo.getById(1);

    expect(mockTypeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBe(user);
  });

  it('update() - deve atualizar usuário e retornar o atualizado', async () => {
    const updatedUser = new UserEntity();

    mockTypeOrmRepo.update.mockResolvedValue({} as UpdateResult);
    jest.spyOn(repo, 'getById').mockResolvedValue(updatedUser);

    const result = await repo.update(1, { name: 'novo nome' });

    expect(mockTypeOrmRepo.update).toHaveBeenCalledWith(1, { name: 'novo nome' });
    expect(result).toBe(updatedUser);
  });

  it('delete() - deve deletar usuário', async () => {
    mockTypeOrmRepo.delete.mockResolvedValue({} as DeleteResult);

    await repo.delete(1);

    expect(mockTypeOrmRepo.delete).toHaveBeenCalledWith(1);
  });
});
