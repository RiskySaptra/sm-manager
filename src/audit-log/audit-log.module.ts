import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [CoreModule],
  providers: [AuditLogService],
})
export class AuditLogModule {}
