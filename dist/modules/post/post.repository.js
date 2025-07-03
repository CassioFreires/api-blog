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
const post_entities_1 = require("./entities/post.entities");
const ps_config_1 = __importDefault(require("../../config/ps.config"));
const user_entities_1 = __importDefault(require("../user/entities/user.entities"));
class PostRepository {
    constructor() {
        this.repo = ps_config_1.default.getRepository(post_entities_1.PostEntity);
        this.repoUser = ps_config_1.default.getRepository(user_entities_1.default);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userExists = yield this.repoUser.findOneBy({ id: (_a = data.user) === null || _a === void 0 ? void 0 : _a.id });
                if (!userExists) {
                    return { message: 'Usuário informado não existe.' };
                }
                const post = yield this.repo.create(data);
                return this.repo.save(post);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.repo.find({ relations: ['user'] });
                return posts;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.repo.findOne({
                    where: { id },
                    relations: ['user']
                });
                return post;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    update(id, updatePostDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repo.update(id, updatePostDto);
                const updatePost = yield this.repo.findOne({ where: { id } });
                return updatePost;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultPost = yield this.repo.findOne({ where: { id } });
                yield this.repo.delete(id);
                return resultPost;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = PostRepository;
