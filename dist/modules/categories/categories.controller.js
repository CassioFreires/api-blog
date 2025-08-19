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
const validation_create_categories_1 = require("./schema/validation-create-categories");
const validation_update_categories_1 = require("./schema/validation-update-categories");
const zod_1 = require("zod");
class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validação do corpo da requisição
                validation_create_categories_1.createCategorySchema.parse(req.body);
                const category = yield this.categoryService.create(req.body);
                return res.status(201).json(category);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    return res.status(400).json({
                        message: 'Erro na validação dos dados',
                        errors: error.errors,
                    });
                }
                // Tratamento para categoria já existente
                if (error.code === '23505' || ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('já existe'))) {
                    return res.status(409).json({ message: 'Categoria já existe' });
                }
                return res.status(500).json({ message: 'Erro ao criar categoria' });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.categoryService.getAll();
                return res.status(200).json(categories);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: error.message || 'Erro ao buscar categorias' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ message: 'ID inválido' });
                const category = yield this.categoryService.getById(id);
                if (!category)
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                return res.status(200).json(category);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: error.message || 'Erro ao buscar categoria' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ message: 'ID inválido' });
                validation_update_categories_1.updateCategorySchema.parse(req.body);
                const updated = yield this.categoryService.update(id, req.body);
                if (!updated)
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                return res.status(200).json(updated);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    return res.status(400).json({
                        message: 'Erro na validação dos dados',
                        errors: error.errors,
                    });
                }
                if (error.code === '42703') {
                    return res.status(400).json({
                        message: 'Campo inválido: um ou mais campos enviados não existem na tabela.',
                    });
                }
                return res.status(500).json({ message: error.message || 'Erro ao atualizar categoria' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ message: 'ID inválido' });
                const deleted = yield this.categoryService.delete(id);
                if (!deleted)
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                return res.status(204).send({ message: 'Categoria deletada com sucesso' });
            }
            catch (error) {
                return res.status(500).json({ message: error.message || 'Erro ao deletar categoria' });
            }
        });
    }
}
exports.default = CategoryController;
