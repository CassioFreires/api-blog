import { Entity, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { RoleEntity } from "../../../modules/role/entities/role.entities";
import { PermissionEntity } from "../../../modules/permission/entities/permission.entitie";

@Entity({name: 'role_permissions', schema: 'public', synchronize:true})
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int' })
  role_id!: number;

  @Column({ type: 'int' })
  permission_id!: number;

  @ManyToOne(() => RoleEntity, role => role.rolePermission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @ManyToOne(() => PermissionEntity, role => role.rolePermission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}