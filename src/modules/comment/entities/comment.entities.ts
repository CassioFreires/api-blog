import { PostEntity } from "../../../modules/post/entities/post.entities";
import UserEntity from "../../../modules/user/entities/user.entities";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type: 'varchar'})
    content!:string;

    @CreateDateColumn()
    createAt!:Date;

    @UpdateDateColumn()
    updateAt!:Date;

    @ManyToOne(() => PostEntity, post => post.comments, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'post_id'})
    post!: PostEntity;

    @ManyToOne(() => UserEntity, user => user.comments, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user!:UserEntity;

}