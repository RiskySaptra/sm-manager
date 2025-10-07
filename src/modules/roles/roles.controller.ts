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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AccessRight } from './entities/access-right.entity';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { SuperAdminGuard } from '../../shared/guards/super-admin.guard';
import { TenancyGuard } from '../../shared/guards/tenancy.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateAccessRightsDto } from './dto/update-access-rights.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(TenancyGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: Role,
  })
  create(
    @Body(ValidationPipe) createRoleDto: CreateRoleDto,
    @GetUser() user: User,
  ): Promise<Role> {
    return this.rolesService.create(createRoleDto, user.organizationId!);
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Return all roles.',
    type: [Role],
  })
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the role.',
    type: Role,
  })
  findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
    type: Role,
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }

  @Post(':id/access-rights')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the access rights for a role' })
  @ApiResponse({
    status: 201,
    description: 'The access rights have been successfully updated.',
    type: AccessRight,
  })
  updateAccessRights(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAccessRightsDto: UpdateAccessRightsDto,
  ): Promise<AccessRight> {
    return this.rolesService.updateAccessRights(id, updateAccessRightsDto);
  }
}
