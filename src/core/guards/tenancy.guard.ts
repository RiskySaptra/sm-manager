import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser } from '../entities/organization-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenancyGuard implements CanActivate {
  constructor(
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.params.organizationId;

    if (user.isSuperAdmin) {
      return true;
    }

    if (!organizationId) {
      return true;
    }

    const organizationUser = await this.organizationUserRepository.findOne({
      where: {
        userId: user.id,
        organizationId,
      },
    });

    return !!organizationUser;
  }
}