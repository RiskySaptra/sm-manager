import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class TenancyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user || !user.organizationId) {
      return false;
    }

    return true;
  }
}
