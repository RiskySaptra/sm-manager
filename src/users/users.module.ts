import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationUser } from 'src/core/entities/organization-user.entity';
import { User } from 'src/core/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, OrganizationUser]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
