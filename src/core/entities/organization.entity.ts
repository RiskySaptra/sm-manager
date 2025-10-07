import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanType } from '../enums/plan-type.enum';
import { OrganizationUser } from './organization-user.entity';
import { Role } from './role.entity';
import { Store } from './store.entity';
import { User } from './user.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.FREE,
  })
  planType: PlanType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.organization)
  stores: Store[];

  @OneToMany(() => Role, (role) => role.organization)
  roles: Role[];

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.organization,
  )
  organizationUsers: OrganizationUser[];
}