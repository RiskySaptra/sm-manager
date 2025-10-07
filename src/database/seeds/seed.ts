import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { User } from '../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../modules/roles/entities/role.entity';
import { AccessRight } from '../../modules/roles/entities/access-right.entity';
import { AccessModule } from '../../shared/enums/access-module.enum';
import { Organization } from '../../modules/organizations/entities/organization.entity';
import { Store } from '../../modules/stores/entities/store.entity';
import { OrganizationUser } from '../../modules/organizations/entities/organization-user.entity';

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

  // Create Super Admin
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

  // Create Organizations
  const org1 = await organizationRepository.save({
    name: 'Tech Solutions Inc.',
    ownerId: superAdmin.id,
  });

  const org2 = await organizationRepository.save({
    name: 'Global Retail Co.',
    ownerId: superAdmin.id,
  });

  // Create Stores
  const store1Org1 = await storeRepository.save({
    name: 'Main Branch',
    organizationId: org1.id,
    location: 'New York',
  });

  const store2Org1 = await storeRepository.save({
    name: 'West Coast Office',
    organizationId: org1.id,
    location: 'San Francisco',
  });

  const store1Org2 = await storeRepository.save({
    name: 'Downtown Store',
    organizationId: org2.id,
    location: 'London',
  });

  // Create Roles
  const adminRoleOrg1 = await roleRepository.save({
    name: 'Administrator',
    organizationId: org1.id,
  });

  const managerRoleOrg1 = await roleRepository.save({
    name: 'Manager',
    organizationId: org1.id,
  });

  const staffRoleOrg1 = await roleRepository.save({
    name: 'Staff',
    organizationId: org1.id,
  });

  const managerRoleOrg2 = await roleRepository.save({
    name: 'General Manager',
    organizationId: org2.id,
  });

  // Assign Access Rights
  await accessRightRepository.save([
    // Admin Role - Full Access
    { roleId: adminRoleOrg1.id, module: AccessModule.INVENTORY, canRead: true, canWrite: true, canDelete: true },
    { roleId: adminRoleOrg1.id, module: AccessModule.SALES, canRead: true, canWrite: true, canDelete: true },
    { roleId: adminRoleOrg1.id, module: AccessModule.USERS, canRead: true, canWrite: true, canDelete: true },
    { roleId: adminRoleOrg1.id, module: AccessModule.REPORTS, canRead: true, canWrite: true, canDelete: true },
    { roleId: adminRoleOrg1.id, module: AccessModule.SETTINGS, canRead: true, canWrite: true, canDelete: true },

    // Manager Role - Limited Access
    { roleId: managerRoleOrg1.id, module: AccessModule.INVENTORY, canRead: true, canWrite: true, canDelete: false },
    { roleId: managerRoleOrg1.id, module: AccessModule.SALES, canRead: true, canWrite: true, canDelete: false },
    { roleId: managerRoleOrg1.id, module: AccessModule.REPORTS, canRead: true, canWrite: false, canDelete: false },

    // Staff Role - Read-Only
    { roleId: staffRoleOrg1.id, module: AccessModule.INVENTORY, canRead: true, canWrite: false, canDelete: false },
    { roleId: staffRoleOrg1.id, module: AccessModule.SALES, canRead: true, canWrite: false, canDelete: false },

    // Manager Role Org 2
    { roleId: managerRoleOrg2.id, module: AccessModule.INVENTORY, canRead: true, canWrite: true, canDelete: true },
    { roleId: managerRoleOrg2.id, module: AccessModule.SALES, canRead: true, canWrite: true, canDelete: true },
  ]);

  // Create Users
  const user1 = await userRepository.save({
    email: 'admin@techsolutions.com',
    passwordHash: hashedPassword,
    name: 'Alice Admin',
  });

  const user2 = await userRepository.save({
    email: 'manager@techsolutions.com',
    passwordHash: hashedPassword,
    name: 'Bob Manager',
  });

  const user3 = await userRepository.save({
    email: 'staff@techsolutions.com',
    passwordHash: hashedPassword,
    name: 'Charlie Staff',
  });

  const user4 = await userRepository.save({
    email: 'manager@globalretail.com',
    passwordHash: hashedPassword,
    name: 'Diana Manager',
  });

  // Assign Users to Organizations
  await organizationUserRepository.save([
    { organizationId: org1.id, storeId: store1Org1.id, userId: user1.id, roleId: adminRoleOrg1.id },
    { organizationId: org1.id, storeId: store1Org1.id, userId: user2.id, roleId: managerRoleOrg1.id },
    { organizationId: org1.id, storeId: store2Org1.id, userId: user3.id, roleId: staffRoleOrg1.id },
    { organizationId: org2.id, storeId: store1Org2.id, userId: user4.id, roleId: managerRoleOrg2.id },
  ]);

  await app.close();
}

void bootstrap();
