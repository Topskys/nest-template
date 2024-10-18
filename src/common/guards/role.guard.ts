import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { DecoratorEnum } from '@/constants/decorator.constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const currentUserRoles = [];
    const roles = this.reflector.get<string[]>(
      DecoratorEnum.ROLES,
      context.getHandler(),
    );
    if (!currentUserRoles?.length) throw new ForbiddenException('暂无权限');
    if (!roles?.length) return true;
    if (!roles.some((role) => currentUserRoles.includes(role)))
      throw new ForbiddenException('暂无权限');
    return true;
  }
}
