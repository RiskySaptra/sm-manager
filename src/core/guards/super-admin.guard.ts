import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    return user && user.isSuperAdmin;
  }
}
