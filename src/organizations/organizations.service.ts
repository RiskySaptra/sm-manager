import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser } from 'src/core/entities/organization-user.entity';
import { Organization } from 'src/core/entities/organization.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
    user: User,
  ): Promise<Organization> {
    const organization = this.organizationRepository.create({
      ...createOrganizationDto,
      ownerId: user.id,
    });

    return this.organizationRepository.save(organization);
  }

  async inviteUser(
    organizationId: string,
    inviteUserDto: InviteUserDto,
    user: User,
  ): Promise<OrganizationUser> {
    const organization = await this.organizationRepository.findOneBy({
      id: organizationId,
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.ownerId !== user.id) {
      throw new UnauthorizedException(
        'You are not the owner of this organization',
      );
    }

    const invitedUser = await this.userRepository.findOneBy({
      email: inviteUserDto.email,
    });

    if (!invitedUser) {
      throw new NotFoundException('User to invite not found');
    }

    const organizationUser = this.organizationUserRepository.create({
      organizationId,
      userId: invitedUser.id,
      roleId: inviteUserDto.roleId,
    });

    return this.organizationUserRepository.save(organizationUser);
  }
}
