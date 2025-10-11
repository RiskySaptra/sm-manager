import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser } from './entities/organization-user.entity';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

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

    if (organization.ownerId !== user.id && !user.isSuperAdmin) {
      throw new UnauthorizedException(
        'You are not the owner of this organization',
      );
    }

    if (!user.isSuperAdmin && !inviteUserDto.storeId) {
      throw new BadRequestException(
        'Store ID is required for non-super admins',
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
      storeId: inviteUserDto.storeId,
    });

    return this.organizationUserRepository.save(organizationUser);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.findOne(id);
    Object.assign(organization, updateOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  async remove(id: string): Promise<void> {
    const result = await this.organizationRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
  }

  async changeOwner(
    organizationId: string,
    ownerId: string,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.findOneBy({
      id: organizationId,
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const newOwner = await this.userRepository.findOneBy({ id: ownerId });

    if (!newOwner) {
      throw new NotFoundException('New owner not found');
    }

    organization.ownerId = ownerId;
    return this.organizationRepository.save(organization);
  }
}
