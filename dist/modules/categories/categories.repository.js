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
exports.CategoryRepository = void 0;
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class CategoryRepository {
    constructor() {
        this.tableName = 'categories';
    }
    // Recebe opcionalmente a transação para operações compostas
    create(data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = trx ? trx(this.tableName) : (0, ps_config_1.default)(this.tableName);
                const [createdCategory] = yield queryBuilder
                    .insert(data)
                    .returning('*');
                return createdCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findAll(trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = trx ? trx(this.tableName) : (0, ps_config_1.default)(this.tableName);
                return yield queryBuilder.select('*');
            }
            catch (error) {
                console.error('Erro ao buscar categorias:', error);
                throw error;
            }
        });
    }
    findById(id, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = trx ? trx(this.tableName) : (0, ps_config_1.default)(this.tableName);
                const category = yield queryBuilder.where({ id }).first();
                return category || null;
            }
            catch (error) {
                console.error(`Erro ao buscar categoria com id ${id}:`, error);
                throw error;
            }
        });
    }
    update(id, data, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = trx ? trx(this.tableName) : (0, ps_config_1.default)(this.tableName);
                const updatedRows = yield queryBuilder
                    .where({ id })
                    .update(data)
                    .returning('*');
                if (updatedRows.length === 0)
                    return null;
                return updatedRows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryBuilder = trx ? trx(this.tableName) : (0, ps_config_1.default)(this.tableName);
                const deletedRows = yield queryBuilder.where({ id }).del();
                return deletedRows > 0;
            }
            catch (error) {
                console.error(`Erro ao deletar categoria com id ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.CategoryRepository = CategoryRepository;
