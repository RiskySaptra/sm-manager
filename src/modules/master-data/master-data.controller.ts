import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MasterDataService } from './master-data.service.js';
import { AccessModule } from './entities/access-module.entity';
import { AuditAction } from './entities/audit-action.entity';
import { PlanType } from './entities/plan-type.entity';
import { UserStatus } from './entities/user-status.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Master Data')
@Controller('master-data')
@UseGuards(AuthGuard())
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('access-modules')
  getAccessModules(): Promise<AccessModule[]> {
    return this.masterDataService.findAllAccessModules();
  }

  @Get('audit-actions')
  getAuditActions(): Promise<AuditAction[]> {
    return this.masterDataService.findAllAuditActions();
  }

  @Get('plan-types')
  getPlanTypes(): Promise<PlanType[]> {
    return this.masterDataService.findAllPlanTypes();
  }

  @Get('user-statuses')
  getUserStatuses(): Promise<UserStatus[]> {
    return this.masterDataService.findAllUserStatuses();
  }
}
