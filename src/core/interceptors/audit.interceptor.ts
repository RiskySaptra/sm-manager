import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { AuditAction } from 'src/core/enums/audit-action.enum';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_KEY } from './audit.decorator';

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

    const { user, params, body } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((data) => {
        this.auditLogService.create({
          organizationId: user.organizationId,
          userId: user.id,
          action: auditAction,
          targetId: params.id || data.id,
          changes: body,
        });
      }),
    );
  }
}