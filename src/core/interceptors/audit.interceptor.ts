import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { AuditAction } from '../enums/audit-action.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body, params } = request;

    return next.handle().pipe(
      tap(async (data) => {
        const action = this.getAction(method);
        if (action) {
          await this.auditLogService.create({
            userId: user.id,
            organizationId: params.organizationId ?? body.organizationId,
            storeId: params.storeId ?? body.storeId,
            action,
            targetTable: this.getTargetTable(url),
            targetId: params.id ?? data.id,
            description: this.getDescription(method, url),
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      }),
    );
  }

  private getAction(method: string): AuditAction | null {
    switch (method) {
      case 'POST':
        return AuditAction.CREATE;
      case 'PUT':
      case 'PATCH':
        return AuditAction.UPDATE;
      case 'DELETE':
        return AuditAction.DELETE;
      default:
        return null;
    }
  }

  private getTargetTable(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[1] ?? 'unknown';
  }

  private getDescription(method: string, url: string): string {
    return `${method} request to ${url}`;
  }
}