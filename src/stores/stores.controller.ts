import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Store } from 'src/core/entities/store.entity';
import { User } from 'src/core/entities/user.entity';
import { SuperAdminGuard } from 'src/core/guards/super-admin.guard';
import { TenancyGuard } from 'src/core/guards/tenancy.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
@UseGuards(AuthGuard())
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(TenancyGuard)
  @ApiBearerAuth()
  create(
    @Body(ValidationPipe) createStoreDto: CreateStoreDto,
    @GetUser() user: User,
  ): Promise<Store> {
    return this.storesService.create(createStoreDto, user.organizationId!);
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  findAll(): Promise<Store[]> {
    return this.storesService.findAll();
  }
}
