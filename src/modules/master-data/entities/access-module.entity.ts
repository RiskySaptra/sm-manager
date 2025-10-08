import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('master_access_modules')
export class AccessModule {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;
}
