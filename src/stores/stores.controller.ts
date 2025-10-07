import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Store } from 'src/core/entities/store.entity';
import { User } from 'src/core/entities/user.entity';
import { TenancyGuard } from 'src/core/guards/tenancy.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
@UseGuards(AuthGuard(), TenancyGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @Body(ValidationPipe) createStoreDto: CreateStoreDto,
    @GetUser() user: User,
  ): Promise<Store> {
    return this.storesService.create(createStoreDto, user.organizationId!);
  }
}
