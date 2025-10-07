import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../../modules/audit-log/audit-log.service';
import { User } from '../../modules/users/entities/user.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_KEY } from '../decorators/audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditAction = this.reflector.getAllAndOverride<AuditAction>(
      AUDIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!auditAction) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<{
      user: User;
      params: { id?: string };
      body: Record<string, any>;
    }>();

    return next.handle().pipe(
      tap((data: { id?: string }) => {
        void this.auditLogService.create({
          organizationId: request.user.organizationId,
          userId: request.user.id,
          action: auditAction,
          targetId: request.params.id ?? data?.id,
          changes: request.body,
        });
      }),
    );
  }
}
