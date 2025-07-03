import { CommentEntity } from "../../../modules/comment/entities/comment.entities";
import { LikeEntity } from "../../../modules/like/entities/like.entities";
import UserEntity from "../../../modules/user/entities/user.entities";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', nullable: true })
    title!: string;

    @Column({ type: 'varchar', nullable: true })
    subtitle!: string;
    
    @Column({ type: 'varchar', nullable: true })
    content!: string;

    @ManyToOne(() => UserEntity, user => user.posts)
    @JoinColumn({name:'user_id'})
    user!: UserEntity;

    @OneToMany(() => LikeEntity, Like => Like.post, {cascade: true})
    likes!:LikeEntity[];

    @OneToMany(() => CommentEntity, comment => comment.post)
    comments!:[];

    createAt!: Date;

    updateAt!: Date;

}