import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('master_audit_actions')
export class AuditAction {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;
}
