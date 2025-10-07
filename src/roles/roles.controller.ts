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
import { Role } from 'src/core/entities/role.entity';
import { User } from 'src/core/entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @Body(ValidationPipe) createRoleDto: CreateRoleDto,
    @GetUser() user: User,
  ): Promise<Role> {
    // This is a placeholder for the organization ID.
    // In a real application, you would get this from the user's session or a tenancy context.
    const organizationId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    return this.rolesService.create(createRoleDto, organizationId);
  }
}
