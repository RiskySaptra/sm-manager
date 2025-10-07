import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessRight } from './entities/access-right.entity';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, AccessRight]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
