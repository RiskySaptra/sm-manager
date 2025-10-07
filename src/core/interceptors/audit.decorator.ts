import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../enums/audit-action.enum';

export const AUDIT_KEY = 'audit';
export const Audit = (action: AuditAction) => SetMetadata(AUDIT_KEY, action);
