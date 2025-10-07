import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { OrganizationUser } from 'src/core/entities/organization-user.entity';
import { Organization } from 'src/core/entities/organization.entity';
import { User } from 'src/core/entities/user.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(AuthGuard())
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiBearerAuth()
  create(
    @Body(ValidationPipe) createOrganizationDto: CreateOrganizationDto,
    @GetUser() user: User,
  ): Promise<Organization> {
    return this.organizationsService.create(createOrganizationDto, user);
  }

  @Post('/:id/users')
  @ApiBearerAuth()
  inviteUser(
    @Param('id') id: string,
    @Body(ValidationPipe) inviteUserDto: InviteUserDto,
    @GetUser() user: User,
  ): Promise<OrganizationUser> {
    return this.organizationsService.inviteUser(id, inviteUserDto, user);
  }
}
