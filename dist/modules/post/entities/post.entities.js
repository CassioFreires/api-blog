"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
const comment_entities_1 = require("../../../modules/comment/entities/comment.entities");
const like_entities_1 = require("../../../modules/like/entities/like.entities");
const user_entities_1 = __importDefault(require("../../../modules/user/entities/user.entities"));
const typeorm_1 = require("typeorm");
let PostEntity = class PostEntity {
};
exports.PostEntity = PostEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "subtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], PostEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entities_1.default, user => user.posts),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entities_1.default)
], PostEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => like_entities_1.LikeEntity, Like => Like.post, { cascade: true }),
    __metadata("design:type", Array)
], PostEntity.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entities_1.CommentEntity, comment => comment.post),
    __metadata("design:type", Array)
], PostEntity.prototype, "comments", void 0);
exports.PostEntity = PostEntity = __decorate([
    (0, typeorm_1.Entity)('post')
], PostEntity);
