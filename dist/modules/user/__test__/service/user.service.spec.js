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
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/user/__test__/service/user.service.spec.ts
const user_service_1 = require("../../user.service");
const mockUser = {
    id: 1,
    name: 'cassio',
    fullName: 'cassio leopoldo freires souza',
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
    const service = new user_service_1.UserService();
    // Substitui o userRepository real pelo mock no service
    // @ts-ignore
    service.userRepository = mockRepository;
    it('create() - deve criar e retornar usuário com dados normalizados', () => __awaiter(void 0, void 0, void 0, function* () {
        const newData = {
            name: 'CASSIO', // será convertido para minúsculo no service
            fullName: 'CASSIO LEOPOLDO FREIRES SOUZA',
            email: 'CASSIO_SOUZA@LIVE.COM',
            password_hash: '123456',
        };
        const result = yield service.create(newData);
        // Verifica se o create do repositório foi chamado com os dados em lowercase
        expect(mockRepository.create).toHaveBeenCalledWith({
            name: 'cassio',
            fullName: 'cassio leopoldo freires souza',
            email: 'cassio_souza@live.com',
            password_hash: '123456',
        });
        // Verifica se o resultado é o usuário mockado
        expect(result).toEqual(mockUser);
    }));
    it('getAll() - deve retornar todos usuários', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getAll();
        expect(mockRepository.getAll).toHaveBeenCalled();
        expect(result).toEqual([mockUser]);
    }));
    it('getById() - deve retornar usuário pelo id', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getById(1);
        expect(mockRepository.getById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
    }));
    it('update() - deve atualizar usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = { fullName: 'Novo Nome' };
        const result = yield service.update(1, updateData);
        expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
        expect(result).toEqual(mockUser);
    }));
    it('delete() - deve chamar delete do repositório', () => __awaiter(void 0, void 0, void 0, function* () {
        yield service.delete(1);
        expect(mockRepository.delete).toHaveBeenCalledWith(1);
    }));
});
