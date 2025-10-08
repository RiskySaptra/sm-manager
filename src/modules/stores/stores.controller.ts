import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Store } from './entities/store.entity';
import { SuperAdminGuard } from '../../shared/guards/super-admin.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDetailsResponseDto } from './dto/store-details-response.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
@UseGuards(AuthGuard())
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({
    status: 201,
    description: 'The store has been successfully created.',
    type: Store,
  })
  create(@Body(ValidationPipe) createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiResponse({
    status: 200,
    description: 'Return all stores.',
    type: [Store],
  })
  findAll(): Promise<Store[]> {
    return this.storesService.findAll();
  }

  @Get(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a store by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the store.',
    type: StoreDetailsResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<StoreDetailsResponseDto> {
    const store = await this.storesService.findOne(id);
    return this.storesService.normalizeStoreDetails(store);
  }

  @Patch(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a store' })
  @ApiResponse({
    status: 200,
    description: 'The store has been successfully updated.',
    type: Store,
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a store' })
  @ApiResponse({
    status: 200,
    description: 'The store has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.storesService.remove(id);
  }
}
