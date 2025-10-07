import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRight } from 'src/core/entities/access-right.entity';
import { OrganizationUser } from 'src/core/entities/organization-user.entity';
import { User } from 'src/core/entities/user.entity';
import { AccessModule } from 'src/core/enums/access-module.enum';
import { Repository } from 'typeorm';
import { PERMISSION_KEY } from './require-permission.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(AccessRight)
    private readonly accessRightRepository: Repository<AccessRight>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      { module: AccessModule; action: 'read' | 'write' } | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    if (!user || !user.organizationId) {
      return false;
    }

    const organizationUser = await this.organizationUserRepository.findOne({
      where: {
        userId: user.id,
        organizationId: user.organizationId,
      },
    });

    if (!organizationUser) {
      return false;
    }

    const accessRight = await this.accessRightRepository.findOne({
      where: {
        roleId: organizationUser.roleId,
        module: requiredPermission.module,
      },
    });

    if (!accessRight) {
      return false;
    }

    return accessRight[
      requiredPermission.action === 'read' ? 'canRead' : 'canWrite'
    ];
  }
}
