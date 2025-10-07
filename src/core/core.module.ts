import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessRight } from './entities/access-right.entity';
import { AuditLog } from './entities/audit-log.entity';
import { OrganizationUser } from './entities/organization-user.entity';
import { Organization } from './entities/organization.entity';
import { Role } from './entities/role.entity';
import { Store } from './entities/store.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Organization,
      Store,
      Role,
      AccessRight,
      OrganizationUser,
      AuditLog,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class CoreModule {}
