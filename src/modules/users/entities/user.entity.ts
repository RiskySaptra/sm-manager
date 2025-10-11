import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { OrganizationUser } from '../../organizations/entities/organization-user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Store } from '../../stores/entities/store.entity';
import { UserStatus } from '../../master-data/entities/user-status.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  @Exclude({ toPlainOnly: true })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  @Exclude({ toPlainOnly: true })
  statusId: string;

  @ManyToOne(() => UserStatus)
  @JoinColumn({ name: 'statusId' })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
  )
  organizationUsers?: OrganizationUser[];

  organizationId?: string;
  organization?: Organization;
  store?: Store;
  role?: Role;
}
