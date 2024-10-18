import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    // 当前角色不在可操作角色范围内
    if (!user.currentRoleCode) throw new ForbiddenException('暂无权限');

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles?.length) return true;
    const hasRole = roles.includes(user.currentRoleCode);
    if (!hasRole) throw new ForbiddenException('暂无权限');
    return true;
  }
}
