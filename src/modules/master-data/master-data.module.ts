import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { AccessModule } from './entities/access-module.entity';
import { AuditAction } from './entities/audit-action.entity';
import { PlanType } from './entities/plan-type.entity';
import { UserStatus } from './entities/user-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessModule, AuditAction, PlanType, UserStatus]),
    AuthModule,
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
})
export class MasterDataModule {}
