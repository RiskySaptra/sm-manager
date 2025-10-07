import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core.module';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [CoreModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
