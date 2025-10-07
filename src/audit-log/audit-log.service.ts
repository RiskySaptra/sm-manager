import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from 'src/core/entities/audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(auditLog: Partial<AuditLog>): Promise<AuditLog> {
    const newLog = this.auditLogRepository.create(auditLog);
    return this.auditLogRepository.save(newLog);
  }
}
