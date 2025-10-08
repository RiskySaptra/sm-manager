import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessModule } from './entities/access-module.entity';
import { AuditAction } from './entities/audit-action.entity';
import { PlanType } from './entities/plan-type.entity';
import { UserStatus } from './entities/user-status.entity';

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(AccessModule)
    private readonly accessModuleRepository: Repository<AccessModule>,
    @InjectRepository(AuditAction)
    private readonly auditActionRepository: Repository<AuditAction>,
    @InjectRepository(PlanType)
    private readonly planTypeRepository: Repository<PlanType>,
    @InjectRepository(UserStatus)
    private readonly userStatusRepository: Repository<UserStatus>,
  ) {}

  findAllAccessModules(): Promise<AccessModule[]> {
    return this.accessModuleRepository.find();
  }

  findAllAuditActions(): Promise<AuditAction[]> {
    return this.auditActionRepository.find();
  }

  findAllPlanTypes(): Promise<PlanType[]> {
    return this.planTypeRepository.find();
  }

  findAllUserStatuses(): Promise<UserStatus[]> {
    return this.userStatusRepository.find();
  }
}
