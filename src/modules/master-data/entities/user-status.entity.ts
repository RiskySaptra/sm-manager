import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('master_user_statuses')
export class UserStatus {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;
}
