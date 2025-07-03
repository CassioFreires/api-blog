import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";
import { PostEntity } from "../../../modules/post/entities/post.entities";
import UserEntity from "../../../modules/user/entities/user.entities";

@Unique(['post', 'user'])
@Entity('like')
export class LikeEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => PostEntity, post => post.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post!: PostEntity;

    @ManyToOne(() => UserEntity, user => user.like, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
