import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessModule } from '../enums/access-module.enum';
import { Role } from './role.entity';

@Entity()
export class AccessRight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.accessRights)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({
    type: 'enum',
    enum: AccessModule,
  })
  module: AccessModule;

  @Column({ type: 'boolean', default: true })
  canRead: boolean;

  @Column({ type: 'boolean', default: false })
  canWrite: boolean;

  @Column({ type: 'boolean', default: false })
  canDelete: boolean;
}
