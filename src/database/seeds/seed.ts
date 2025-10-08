import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app/app.module';
import { User } from '../../modules/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../modules/roles/entities/role.entity';
import { Organization } from '../../modules/organizations/entities/organization.entity';
import { Store } from '../../modules/stores/entities/store.entity';
import { OrganizationUser } from '../../modules/organizations/entities/organization-user.entity';
import seedMasterData from './master-data.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  const organizationRepository = app.get<Repository<Organization>>(
    getRepositoryToken(Organization),
  );
  const roleRepository = app.get<Repository<Role>>(getRepositoryToken(Role));
  const storeRepository = app.get<Repository<Store>>(getRepositoryToken(Store));
  const organizationUserRepository = app.get<Repository<OrganizationUser>>(
    getRepositoryToken(OrganizationUser),
  );

  // Seed Master Data
  await seedMasterData(app.get(DataSource));

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
  let org1 = await organizationRepository.findOneBy({
    name: 'Tech Solutions Inc.',
  });
  if (!org1) {
    org1 = await organizationRepository.save({
      name: 'Tech Solutions Inc.',
      ownerId: superAdmin.id,
    });
  }

  let org2 = await organizationRepository.findOneBy({
    name: 'Global Retail Co.',
  });
  if (!org2) {
    org2 = await organizationRepository.save({
      name: 'Global Retail Co.',
      ownerId: superAdmin.id,
    });
  }

  // Create Stores
  let store1Org1 = await storeRepository.findOneBy({ name: 'Main Branch' });
  if (!store1Org1) {
    store1Org1 = await storeRepository.save({
      name: 'Main Branch',
      organizationId: org1.id,
      location: 'New York',
    });
  }

  let store2Org1 = await storeRepository.findOneBy({
    name: 'West Coast Office',
  });
  if (!store2Org1) {
    store2Org1 = await storeRepository.save({
      name: 'West Coast Office',
      organizationId: org1.id,
      location: 'San Francisco',
    });
  }

  let store1Org2 = await storeRepository.findOneBy({ name: 'Downtown Store' });
  if (!store1Org2) {
    store1Org2 = await storeRepository.save({
      name: 'Downtown Store',
      organizationId: org2.id,
      location: 'London',
    });
  }

  // Create Roles
  let adminRoleOrg1 = await roleRepository.findOneBy({ name: 'Administrator' });
  if (!adminRoleOrg1) {
    adminRoleOrg1 = await roleRepository.save({
      name: 'Administrator',
      organizationId: org1.id,
    });
  }

  let managerRoleOrg1 = await roleRepository.findOneBy({ name: 'Manager' });
  if (!managerRoleOrg1) {
    managerRoleOrg1 = await roleRepository.save({
      name: 'Manager',
      organizationId: org1.id,
    });
  }

  let staffRoleOrg1 = await roleRepository.findOneBy({ name: 'Staff' });
  if (!staffRoleOrg1) {
    staffRoleOrg1 = await roleRepository.save({
      name: 'Staff',
      organizationId: org1.id,
    });
  }

  let managerRoleOrg2 = await roleRepository.findOneBy({
    name: 'General Manager',
  });
  if (!managerRoleOrg2) {
    managerRoleOrg2 = await roleRepository.save({
      name: 'General Manager',
      organizationId: org2.id,
    });
  }

  // Create Users
  let user1 = await userRepository.findOneBy({
    email: 'admin@techsolutions.com',
  });
  if (!user1) {
    user1 = await userRepository.save({
      email: 'admin@techsolutions.com',
      passwordHash: hashedPassword,
      name: 'Alice Admin',
    });
  }

  let user2 = await userRepository.findOneBy({
    email: 'manager@techsolutions.com',
  });
  if (!user2) {
    user2 = await userRepository.save({
      email: 'manager@techsolutions.com',
      passwordHash: hashedPassword,
      name: 'Bob Manager',
    });
  }

  let user3 = await userRepository.findOneBy({
    email: 'staff@techsolutions.com',
  });
  if (!user3) {
    user3 = await userRepository.save({
      email: 'staff@techsolutions.com',
      passwordHash: hashedPassword,
      name: 'Charlie Staff',
    });
  }

  let user4 = await userRepository.findOneBy({
    email: 'manager@globalretail.com',
  });
  if (!user4) {
    user4 = await userRepository.save({
      email: 'manager@globalretail.com',
      passwordHash: hashedPassword,
      name: 'Diana Manager',
    });
  }

  // Assign Users to Organizations
  const orgUser1 = await organizationUserRepository.findOneBy({
    userId: user1.id,
  });
  if (!orgUser1) {
    await organizationUserRepository.save({
      organizationId: org1.id,
      storeId: store1Org1.id,
      userId: user1.id,
      roleId: adminRoleOrg1.id,
    });
  }

  const orgUser2 = await organizationUserRepository.findOneBy({
    userId: user2.id,
  });
  if (!orgUser2) {
    await organizationUserRepository.save({
      organizationId: org1.id,
      storeId: store1Org1.id,
      userId: user2.id,
      roleId: managerRoleOrg1.id,
    });
  }

  const orgUser3 = await organizationUserRepository.findOneBy({
    userId: user3.id,
  });
  if (!orgUser3) {
    await organizationUserRepository.save({
      organizationId: org1.id,
      storeId: store2Org1.id,
      userId: user3.id,
      roleId: staffRoleOrg1.id,
    });
  }

  const orgUser4 = await organizationUserRepository.findOneBy({
    userId: user4.id,
  });
  if (!orgUser4) {
    await organizationUserRepository.save({
      organizationId: org2.id,
      storeId: store1Org2.id,
      userId: user4.id,
      roleId: managerRoleOrg2.id,
    });
  }

  await app.close();
}

void bootstrap();
