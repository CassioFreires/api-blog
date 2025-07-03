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
exports.RoleService = void 0;
const role_repository_1 = require("./role.repository");
class RoleService {
    constructor() {
        this.roleRepository = new role_repository_1.RoleRepository();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = {
                    name: data.name.toLocaleLowerCase(),
                    description: data.description.toLocaleLowerCase(),
                };
                return yield this.roleRepository.create(newData);
            }
            catch (error) {
                console.error('Erro ao criar role:', error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.getAll();
            }
            catch (error) {
                console.error('Erro ao buscar todos roles:', error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.getById(id); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar role com id ${id}:`, error);
                throw error;
            }
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.roleRepository.getByName(name); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar role com name ${name}:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.roleRepository.update(id, data);
                return yield this.roleRepository.getById(id); // pode retornar null
            }
            catch (error) {
                console.error(`Erro ao atualizar role com id ${id}:`, error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.roleRepository.delete(id);
            }
            catch (error) {
                console.error(`Erro ao deletar role com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.RoleService = RoleService;
