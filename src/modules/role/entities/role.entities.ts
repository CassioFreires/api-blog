import { RolePermissionEntity } from '../../../modules/role_permission/entities/create-role-permission';
import UserEntity from '../../user/entities/user.entities';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => RolePermissionEntity, rp => rp.role)
  rolePermission!:RolePermissionEntity[]

  @OneToMany(() => UserEntity, user => user.role)
  user!: UserEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
