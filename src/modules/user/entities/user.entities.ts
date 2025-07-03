import { boolean } from 'zod';
import { CommentEntity } from '../../../modules/comment/entities/comment.entities';
import { LikeEntity } from '../../../modules/like/entities/like.entities';
import { PostEntity } from '../../../modules/post/entities/post.entities';
import { RoleEntity } from '../../role/entities/role.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false, default: 'sem nome' })
  name!: string;

  @Column({ length: 100 })
  fullName!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ select: false })
  password_hash!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => RoleEntity, role => role.user, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @Column({ nullable: true })
  role_id?: number;

  @OneToMany(() => LikeEntity, Like => Like.user)
  like!: LikeEntity[];

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments!: CommentEntity[];

  @OneToMany(() => PostEntity, post => post.user)
  posts!: PostEntity[];

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled!: boolean;

  @Column({ nullable: true, select: false })
  twoFactorSecret?: string;

  @Column({ type: 'text', nullable: true, select: false })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
