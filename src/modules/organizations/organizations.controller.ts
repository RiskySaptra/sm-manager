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
import { OrganizationUser } from './entities/organization-user.entity';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { SuperAdminGuard } from '../../shared/guards/super-admin.guard';
import { ChangeOwnerDto } from './dto/change-owner.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(AuthGuard())
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({
    status: 201,
    description: 'The organization has been successfully created.',
    type: Organization,
  })
  create(
    @Body(ValidationPipe) createOrganizationDto: CreateOrganizationDto,
    @GetUser() user: User,
  ): Promise<Organization> {
    return this.organizationsService.create(createOrganizationDto, user);
  }

  @Post('/:id/users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a user to an organization' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully invited.',
    type: OrganizationUser,
  })
  inviteUser(
    @Param('id') id: string,
    @Body(ValidationPipe) inviteUserDto: InviteUserDto,
    @GetUser() user: User,
  ): Promise<OrganizationUser> {
    return this.organizationsService.inviteUser(id, inviteUserDto, user);
  }

  @Patch('/:id/owner')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change the owner of an organization' })
  @ApiResponse({
    status: 200,
    description: 'The organization owner has been successfully changed.',
    type: Organization,
  })
  changeOwner(
    @Param('id') id: string,
    @Body(ValidationPipe) changeOwnerDto: ChangeOwnerDto,
  ): Promise<Organization> {
    return this.organizationsService.changeOwner(id, changeOwnerDto.ownerId);
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: 200,
    description: 'Return all organizations.',
    type: [Organization],
  })
  findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the organization.',
    type: Organization,
  })
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully updated.',
    type: Organization,
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
