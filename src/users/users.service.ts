import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser } from 'src/core/entities/organization-user.entity';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';

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

    if (organizationId) {
      const organizationUser = await this.organizationUserRepository.findOne({
        where: {
          userId: user.id,
          organizationId,
        },
        relations: ['organization', 'store', 'role'],
      });
      if (organizationUser) {
        user.organization = organizationUser.organization;
        user.store = organizationUser.store;
        user.role = organizationUser.role;
      }
    }
    delete user.organizationUsers;
    return user;
  }
}