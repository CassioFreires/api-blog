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
exports.PermissionRepository = void 0;
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class PermissionRepository {
    constructor() {
        this.table = "permissions";
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [permission] = yield (0, ps_config_1.default)(this.table)
                    .insert({
                    name: data.name,
                    description: data.description,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                    .returning("*");
                return permission;
            }
            catch (error) {
                console.error("Erro ao criar permission no repositório:", error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, ps_config_1.default)(this.table).select("*");
            }
            catch (error) {
                console.error("Erro ao buscar todas permissões no repositório:", error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .first();
                return permission !== null && permission !== void 0 ? permission : null;
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
                const permission = yield (0, ps_config_1.default)(this.table)
                    .where({ name })
                    .first();
                return permission !== null && permission !== void 0 ? permission : null;
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
                yield (0, ps_config_1.default)(this.table)
                    .where({ id })
                    .update(Object.assign(Object.assign({}, data), { updated_at: new Date() }));
                const updatedPermission = yield this.getById(id);
                return updatedPermission;
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
                yield (0, ps_config_1.default)(this.table).where({ id }).del();
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
                return yield (0, ps_config_1.default)(this.table).whereIn("id", ids);
            }
            catch (error) {
                console.error("Erro ao buscar permissões pelos IDs:", error);
                throw error;
            }
        });
    }
}
exports.PermissionRepository = PermissionRepository;
