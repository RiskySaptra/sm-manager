import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser } from '../organizations/entities/organization-user.entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
