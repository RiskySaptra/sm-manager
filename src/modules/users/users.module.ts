import { forwardRef, Module } from '@nestjs/common';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationUser } from '../organizations/entities/organization-user.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, OrganizationUser]),
    forwardRef(() => OrganizationsModule),
  ],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
