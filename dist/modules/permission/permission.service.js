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
exports.PermissionService = void 0;
const permission_repository_1 = require("./permission.repository");
class PermissionService {
    constructor() {
        this.permissionRepository = new permission_repository_1.PermissionRepository();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = {
                    name: data.name.toLocaleLowerCase(),
                    description: data.description.toLocaleLowerCase(),
                };
                return yield this.permissionRepository.create(newData);
            }
            catch (error) {
                console.error('Erro ao criar permission:', error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.permissionRepository.getAll();
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
                return yield this.permissionRepository.getById(id); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar permission com id ${id}:`, error);
                throw error;
            }
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.permissionRepository.getByName(name); // apenas retorna null se não encontrar
            }
            catch (error) {
                console.error(`Erro ao buscar permission com name ${name}:`, error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.permissionRepository.update(id, data);
                return yield this.permissionRepository.getById(id); // pode retornar null
            }
            catch (error) {
                console.error(`Erro ao atualizar permission com id ${id}:`, error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.permissionRepository.delete(id);
            }
            catch (error) {
                console.error(`Erro ao deletar permission com id ${id}:`, error);
                throw error;
            }
        });
    }
    findByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.permissionRepository.findByIds(ids);
            }
            catch (error) {
                console.error('Erro ao buscar permissões pelos IDs no service:', error);
                throw error;
            }
        });
    }
}
exports.PermissionService = PermissionService;
