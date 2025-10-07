import { SetMetadata } from '@nestjs/common';
import { AccessModule } from '../enums/access-module.enum';

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (
  module: AccessModule,
  action: 'read' | 'write',
) => SetMetadata(PERMISSION_KEY, { module, action });
