import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser } from '../organizations/entities/organization-user.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignUserDto } from './dto/assign-user.dto';
import { UserDetailsResponseDto } from './dto/user-details.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
  ) {}

  async me(user: User): Promise<User> {
    const organizationId =
      user.organizationId ?? user.organizationUsers?.[0]?.organizationId;

    const currentUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.status', 'status')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!currentUser) {
      throw new NotFoundException(`User with ID "${user.id}" not found`);
    }

    if (organizationId) {
      const organizationUser = await this.organizationUserRepository.findOne({
        where: {
          userId: user.id,
          organizationId,
        },
        relations: ['organization', 'store', 'role'],
      });
      if (organizationUser) {
        currentUser.organization = organizationUser.organization;
        currentUser.store = organizationUser.store;
        currentUser.role = organizationUser.role;
      }
    }
    delete currentUser.organizationUsers;
    return currentUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserDetailsResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'organizationUsers',
        'organizationUsers.store',
        'organizationUsers.role',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const response: UserDetailsResponseDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      statusId: user.statusId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };

    if (user.organizationUsers && user.organizationUsers.length > 0) {
      response.organizationId = user.organizationUsers[0].organizationId;
      response.stores = user.organizationUsers.map((ou) => ({
        id: ou.store.id,
        name: ou.store.name,
        role: ou.role.name,
      }));
    }

    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
  async assignUser(assignUserDto: AssignUserDto): Promise<OrganizationUser> {
    const { userId, organizationId, storeId, roleId } = assignUserDto;

    const existingAssignment = await this.organizationUserRepository.findOne({
      where: { userId, storeId },
    });

    if (existingAssignment) {
      throw new ConflictException(
        `User with ID "${userId}" is already assigned to store with ID "${storeId}"`,
      );
    }

    const organizationUser = this.organizationUserRepository.create({
      userId,
      organizationId,
      storeId,
      roleId,
    });

    return this.organizationUserRepository.save(organizationUser);
  }
  async removeStoreFromUser(userId: string, storeId: string): Promise<void> {
    const result = await this.organizationUserRepository.softDelete({
      userId,
      storeId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `User with ID "${userId}" is not assigned to store with ID "${storeId}"`,
      );
    }
  }
}
