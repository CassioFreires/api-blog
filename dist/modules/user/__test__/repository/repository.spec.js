"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../../user.repository");
const user_entities_1 = __importDefault(require("../../entities/user.entities"));
const ps_config_1 = __importDefault(require("../../../../config/ps.config"));
describe('UserRepository', () => {
    let repo;
    let mockTypeOrmRepo;
    beforeEach(() => {
        // Criação do mock dos métodos do TypeORM Repository
        mockTypeOrmRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        // Espiona o default export (PsDatabase) e mocka getRepository()
        jest.spyOn(ps_config_1.default, 'getRepository').mockReturnValue(mockTypeOrmRepo);
        // Instancia a classe e substitui o repo interno
        repo = new user_repository_1.UserRepository();
        repo.repo = mockTypeOrmRepo;
    });
    it('create() - deve criar e salvar um usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { name: 'cassio', fullName: 'Cassio Souza', email: 'cassio@teste.com', password_hash: '123456' };
        const userEntity = new user_entities_1.default();
        mockTypeOrmRepo.create.mockReturnValue(userEntity);
        mockTypeOrmRepo.save.mockResolvedValue(userEntity);
        const result = yield repo.create(data);
        expect(mockTypeOrmRepo.create).toHaveBeenCalledWith(data);
        expect(mockTypeOrmRepo.save).toHaveBeenCalledWith(userEntity);
        expect(result).toBe(userEntity);
    }));
    it('getAll() - deve retornar todos os usuários', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = [new user_entities_1.default(), new user_entities_1.default()];
        mockTypeOrmRepo.find.mockResolvedValue(users);
        const result = yield repo.getAll();
        expect(mockTypeOrmRepo.find).toHaveBeenCalled();
        expect(result).toBe(users);
    }));
    it('getById() - deve retornar usuário pelo id', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new user_entities_1.default();
        mockTypeOrmRepo.findOneBy.mockResolvedValue(user);
        const result = yield repo.getById(1);
        expect(mockTypeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBe(user);
    }));
    it('update() - deve atualizar usuário e retornar o atualizado', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = new user_entities_1.default();
        mockTypeOrmRepo.update.mockResolvedValue({});
        jest.spyOn(repo, 'getById').mockResolvedValue(updatedUser);
        const result = yield repo.update(1, { name: 'novo nome' });
        expect(mockTypeOrmRepo.update).toHaveBeenCalledWith(1, { name: 'novo nome' });
        expect(result).toBe(updatedUser);
    }));
    it('delete() - deve deletar usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        mockTypeOrmRepo.delete.mockResolvedValue({});
        yield repo.delete(1);
        expect(mockTypeOrmRepo.delete).toHaveBeenCalledWith(1);
    }));
});
