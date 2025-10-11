import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { AccessModule } from '../../master-data/entities/access-module.entity';

@Entity()
export class AccessRight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.accessRights)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'varchar', length: 50 })
  moduleId: string;

  @ManyToOne(() => AccessModule)
  @JoinColumn({ name: 'moduleId' })
  module: AccessModule;

  @Column({ type: 'boolean', default: true })
  canRead: boolean;

  @Column({ type: 'boolean', default: false })
  canWrite: boolean;

  @Column({ type: 'boolean', default: false })
  canDelete: boolean;

  @DeleteDateColumn()
  deletedAt?: Date;
}
