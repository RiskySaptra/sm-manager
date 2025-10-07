import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [CoreModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
