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
const user_controller_1 = require("../../user.controller");
const mocks_1 = require("../../../../shared/test/mocks");
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
    };
    // Cria o controller passando o mock do service
    const controller = new user_controller_1.UserController(mockService);
    // Cria um mock da requisição
    const mockReq = {
        body: mockUser,
        params: { id: '1' },
    };
    it('create() - deve retornar 201 e o usuário criado', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, mocks_1.createMockResponse)();
        yield controller.create(mockReq, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created', data: mockUser });
    }));
    it('getAll() - deve retornar 200 e todos os usuários', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, mocks_1.createMockResponse)();
        yield controller.getAll(mockReq, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Users fetched', data: [mockUser] });
    }));
    it('getById() - deve retornar 200 e o usuário correspondente', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, mocks_1.createMockResponse)();
        yield controller.getById(mockReq, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User fetched', data: mockUser });
    }));
    it('update() - deve retornar 200 e o usuário atualizado', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, mocks_1.createMockResponse)();
        yield controller.update(mockReq, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User updated', data: mockUser });
    }));
    it('delete() - deve retornar 200 e null', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, mocks_1.createMockResponse)();
        yield controller.delete(mockReq, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted', data: null });
    }));
});
