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

  await app.close();
}

bootstrap();