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
const like_entities_1 = require("./entities/like.entities");
const ps_config_1 = __importDefault(require("../../config/ps.config"));
class LikeRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(like_entities_1.LikeEntity);
    }
    toggle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, post_id } = data;
            const existing = yield this.repo.findOne({
                where: {
                    user: { id: user_id },
                    post: { id: post_id },
                },
                relations: ["user", "post"],
            });
            if (existing) {
                yield this.repo.remove(existing);
                return false; // Descurtido
            }
            const like = this.repo.create({
                user: { id: user_id },
                post: { id: post_id },
            });
            yield this.repo.save(like);
            return true; // Curtido
        });
    }
    countByPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.count({
                where: {
                    post: { id: post_id },
                },
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repo.find({
                    relations: ['user', 'post']
                });
                return {
                    data: result,
                    message: 'Likes encontrados com sucesso',
                };
            }
            catch (error) {
                console.log(error);
                return {
                    error,
                    message: 'Erro ao buscar likes',
                };
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repo.findOne({
                    where: { id: id },
                    relations: ['user', 'post']
                });
                return {
                    data: result,
                    message: 'Likes encontrados com sucesso',
                };
            }
            catch (error) {
                console.log(error);
                return {
                    error,
                    message: 'Erro ao buscar likes',
                };
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const remove = yield this.repo.delete({ id: id });
                return remove;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = LikeRepository;
