import { DataSource } from 'typeorm';
import { AccessModule as AccessModuleEntity } from '../../modules/master-data/entities/access-module.entity';
import { AuditAction as AuditActionEntity } from '../../modules/master-data/entities/audit-action.entity';
import { PlanType as PlanTypeEntity } from '../../modules/master-data/entities/plan-type.entity';
import { UserStatus as UserStatusEntity } from '../../modules/master-data/entities/user-status.entity';

const seedMasterData = async (dataSource: DataSource): Promise<void> => {
  const accessModuleRepository = dataSource.getRepository(AccessModuleEntity);
  const auditActionRepository = dataSource.getRepository(AuditActionEntity);
  const planTypeRepository = dataSource.getRepository(PlanTypeEntity);
  const userStatusRepository = dataSource.getRepository(UserStatusEntity);

  const accessModules = [
    { id: 'INVENTORY', name: 'Inventory' },
    { id: 'SALES', name: 'Sales' },
    { id: 'USERS', name: 'Users' },
    { id: 'REPORTS', name: 'Reports' },
    { id: 'SETTINGS', name: 'Settings' },
  ];

  const auditActions = [
    { id: 'CREATE', name: 'Create' },
    { id: 'UPDATE', name: 'Update' },
    { id: 'DELETE', name: 'Delete' },
    { id: 'LOGIN', name: 'Login' },
    { id: 'LOGOUT', name: 'Logout' },
  ];

  const planTypes = [
    { id: 'FREE', name: 'Free' },
    { id: 'BASIC', name: 'Basic' },
    { id: 'PREMIUM', name: 'Premium' },
  ];

  const userStatuses = [
    { id: 'ACTIVE', name: 'Active' },
    { id: 'INACTIVE', name: 'Inactive' },
    { id: 'SUSPENDED', name: 'Suspended' },
  ];

  await accessModuleRepository.upsert(accessModules, ['id']);
  await auditActionRepository.upsert(auditActions, ['id']);
  await planTypeRepository.upsert(planTypes, ['id']);
  await userStatusRepository.upsert(userStatuses, ['id']);
};

export default seedMasterData;
