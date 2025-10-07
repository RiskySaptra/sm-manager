import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
