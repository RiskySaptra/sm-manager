import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { OrganizationUser } from '../entities/organization-user.entity';
import { AccessRight } from '../entities/access-right.entity';
import { AccessModule } from '../enums/access-module.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(OrganizationUser)
    private readonly organizationUserRepository: Repository<OrganizationUser>,
    @InjectRepository(AccessRight)
    private readonly accessRightRepository: Repository<AccessRight>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<
      { module: AccessModule; permission: 'canRead' | 'canWrite' | 'canDelete' }[]
    >('permissions', context.getHandler());

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const organizationId =
      request.params.organizationId ?? request.body.organizationId;

    if (!organizationId) {
      return false;
    }

    const organizationUser = await this.organizationUserRepository.findOne({
      where: {
        userId: user.id,
        organizationId,
      },
    });

    if (!organizationUser) {
      return false;
    }

    const accessRights = await this.accessRightRepository.find({
      where: {
        roleId: organizationUser.roleId,
      },
    });

    return requiredPermissions.every((requiredPermission) => {
      const accessRight = accessRights.find(
        (ar) => ar.module === requiredPermission.module,
      );
      return accessRight && accessRight[requiredPermission.permission];
    });
  }
}