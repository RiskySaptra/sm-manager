import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../core/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../core/entities/role.entity';
import { AccessRight } from '../core/entities/access-right.entity';
import { AccessModule } from '../core/enums/access-module.enum';
import { Organization } from '../core/entities/organization.entity';
import { Store } from '../core/entities/store.entity';
import { OrganizationUser } from '../core/entities/organization-user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const organizationRepository = app.get<Repository<Organization>>(
    getRepositoryToken(Organization),
  );
  const roleRepository = app.get<Repository<Role>>(getRepositoryToken(Role));
  const accessRightRepository = app.get<Repository<AccessRight>>(
    getRepositoryToken(AccessRight),
  );
  const storeRepository = app.get<Repository<Store>>(getRepositoryToken(Store));
  const organizationUserRepository = app.get<Repository<OrganizationUser>>(
    getRepositoryToken(OrganizationUser),
  );

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('password', salt);

  let superAdmin = await userRepository.findOneBy({
    email: 'superadmin@example.com',
  });

  if (!superAdmin) {
    superAdmin = await userRepository.save({
      email: 'superadmin@example.com',
      passwordHash: hashedPassword,
      name: 'Super Admin',
      isSuperAdmin: true,
    });
  }

  const organization = await organizationRepository.save({
    name: 'Default Organization',
    ownerId: superAdmin.id,
  });

  const adminRole = await roleRepository.save({
    name: 'Admin',
    organizationId: organization.id,
  });

  await accessRightRepository.save([
    {
      roleId: adminRole.id,
      module: AccessModule.INVENTORY,
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      roleId: adminRole.id,
      module: AccessModule.SALES,
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      roleId: adminRole.id,
      module: AccessModule.USERS,
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      roleId: adminRole.id,
      module: AccessModule.REPORTS,
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
    {
      roleId: adminRole.id,
      module: AccessModule.SETTINGS,
      canRead: true,
      canWrite: true,
      canDelete: true,
    },
  ]);

  const managerRole = await roleRepository.save({
    name: 'Manager',
    organizationId: organization.id,
  });

  await accessRightRepository.save([
    {
      roleId: managerRole.id,
      module: AccessModule.INVENTORY,
      canRead: true,
      canWrite: true,
      canDelete: false,
    },
    {
      roleId: managerRole.id,
      module: AccessModule.SALES,
      canRead: true,
      canWrite: true,
      canDelete: false,
    },
  ]);

  const store = await storeRepository.save({
    name: 'Default Store',
    organizationId: organization.id,
  });

  let manager = await userRepository.findOneBy({
    email: 'manager@example.com',
  });

  if (!manager) {
    manager = await userRepository.save({
      email: 'manager@example.com',
      passwordHash: hashedPassword,
      name: 'Manager',
    });
  }

  await organizationUserRepository.save({
    organizationId: organization.id,
    storeId: store.id,
    userId: manager.id,
    roleId: managerRole.id,
  });

  await app.close();
}

bootstrap();