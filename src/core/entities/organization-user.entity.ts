import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';
import { Organization } from './organization.entity';
import { Role } from './role.entity';
import { Store } from './store.entity';
import { User } from './user.entity';

@Entity()
export class OrganizationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationUsers,
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column({ type: 'uuid' })
  storeId: string;

  @ManyToOne(() => Store, (store) => store.organizationUsers)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.organizationUsers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;
}
