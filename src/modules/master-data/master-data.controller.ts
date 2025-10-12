import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { MasterDataService } from './master-data.service.js';
import { AccessModule } from './entities/access-module.entity.js';
import { AuditAction } from './entities/audit-action.entity.js';
import { PlanType } from './entities/plan-type.entity.js';
import { UserStatus } from './entities/user-status.entity.js';
import { SuperAdminGuard } from '../../shared/guards/super-admin.guard.js';

@ApiTags('Master Data')
@ApiBearerAuth()
@UseGuards(AuthGuard(), SuperAdminGuard)
@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('access-modules')
  async getAccessModules(): Promise<AccessModule[]> {
    return this.masterDataService.findAllAccessModules();
  }

  @Get('audit-actions')
  async getAuditActions(): Promise<AuditAction[]> {
    return this.masterDataService.findAllAuditActions();
  }

  @Get('plan-types')
  async getPlanTypes(): Promise<PlanType[]> {
    return this.masterDataService.findAllPlanTypes();
  }

  @Get('user-statuses')
  async getUserStatuses(): Promise<UserStatus[]> {
    return this.masterDataService.findAllUserStatuses();
  }
}
