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
const comment_repository_1 = __importDefault(require("./comment.repository"));
class CommentService {
    constructor() {
        this.commentRepository = new comment_repository_1.default();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.commentRepository.create(data);
                return comment;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAllCommentsByPost(post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.commentRepository.getAllCommentsByPost(post_id);
                return result;
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
                const comments = yield this.commentRepository.getAll();
                ;
                return comments;
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
                const comment = yield this.commentRepository.getById(id);
                return comment;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedComment = yield this.commentRepository.update(id, data);
                return updatedComment;
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
                return yield this.commentRepository.delete(id);
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = CommentService;
