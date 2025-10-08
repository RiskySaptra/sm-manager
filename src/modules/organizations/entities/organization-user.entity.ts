import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { UserStatus } from '../../master-data/entities/user-status.entity';
import { Role } from '../../roles/entities/role.entity';
import { Store } from '../../stores/entities/store.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  statusId: string;

  @ManyToOne(() => UserStatus)
  @JoinColumn({ name: 'statusId' })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;
}
