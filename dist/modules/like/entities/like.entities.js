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
exports.LikeEntity = void 0;
const typeorm_1 = require("typeorm");
const post_entities_1 = require("../../../modules/post/entities/post.entities");
const user_entities_1 = __importDefault(require("../../../modules/user/entities/user.entities"));
let LikeEntity = class LikeEntity {
};
exports.LikeEntity = LikeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LikeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => post_entities_1.PostEntity, post => post.likes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", post_entities_1.PostEntity)
], LikeEntity.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entities_1.default, user => user.like, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entities_1.default)
], LikeEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LikeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LikeEntity.prototype, "updatedAt", void 0);
exports.LikeEntity = LikeEntity = __decorate([
    (0, typeorm_1.Unique)(['post', 'user']),
    (0, typeorm_1.Entity)('like')
], LikeEntity);
