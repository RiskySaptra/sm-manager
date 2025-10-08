import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MasterDataController } from './master-data.controller.js';
import { MasterDataService } from './master-data.service.js';
import { AccessModule } from './entities/access-module.entity.js';
import { AuditAction } from './entities/audit-action.entity.js';
import { PlanType } from './entities/plan-type.entity.js';
import { UserStatus } from './entities/user-status.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessModule, AuditAction, PlanType, UserStatus]),
    AuthModule,
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
