import { SetMetadata } from '@nestjs/common';
export const PERMISSION_KEY = 'permission';
export const RequirePermission = (module: string, action: 'read' | 'write') =>
  SetMetadata(PERMISSION_KEY, { module, action });
