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
const post_repository_1 = __importDefault(require("./post.repository"));
class PostService {
    constructor() {
        this.postRepository = new post_repository_1.default();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = {
                    title: data.title.toLocaleLowerCase(),
                    subtitle: data.subtitle.toLocaleLowerCase(),
                    content: data.content.toLocaleLowerCase(),
                    user: { id: data.user_id }
                };
                const post = yield this.postRepository.create(newData);
                return post;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.postRepository.getAll();
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
                const post = yield this.postRepository.getById(id);
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
            var _a, _b, _c;
            try {
                const newUpdatePostDto = {
                    title: (_a = updatePostDto.title) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase(),
                    subtitle: (_b = updatePostDto.subtitle) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase(),
                    content: (_c = updatePostDto.content) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()
                };
                const updatePost = yield this.postRepository.update(id, newUpdatePostDto);
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
                const post = yield this.postRepository.delete(id);
                return post;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = PostService;
