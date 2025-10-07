import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [CoreModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
