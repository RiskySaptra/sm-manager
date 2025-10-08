import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('master_plan_types')
export class PlanType {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;
}
