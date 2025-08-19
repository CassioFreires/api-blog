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
exports.CategoryService = void 0;
const categories_repository_1 = require("./categories.repository");
class CategoryService {
    constructor(categoryRepo = new categories_repository_1.CategoryRepository()) {
        this.categoryRepo = categoryRepo;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name || data.name.trim().length < 3) {
                throw new Error('Nome da categoria é obrigatório e deve ter pelo menos 3 caracteres');
            }
            return this.categoryRepo.create(data);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.categoryRepo.findAll();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID inválido');
            }
            const category = yield this.categoryRepo.findById(id);
            if (!category) {
                return null;
            }
            return category;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID inválido');
            }
            if (data.name && data.name.trim().length < 3) {
                throw new Error('Nome da categoria deve ter pelo menos 3 caracteres');
            }
            const updated = yield this.categoryRepo.update(id, data);
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID inválido');
            }
            return this.categoryRepo.delete(id);
        });
    }
}
exports.CategoryService = CategoryService;
