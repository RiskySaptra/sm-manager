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
import { CreateStoreDto } from './dto/create-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
@UseGuards(AuthGuard())
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @Body(ValidationPipe) createStoreDto: CreateStoreDto,
    @GetUser() user: User,
  ): Promise<Store> {
    // This is a placeholder for the organization ID.
    // In a real application, you would get this from the user's session or a tenancy context.
    const organizationId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    return this.storesService.create(createStoreDto, organizationId);
  }
}
