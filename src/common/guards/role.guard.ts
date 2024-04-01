import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CustomException, ErrorCode } from '../exceptions/custom.exception';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const currentUserRoles = []
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!currentUserRoles?.length) throw new CustomException(ErrorCode.ERR_11003);
    if (!roles?.length) return true;
    if (!roles.some(role => currentUserRoles.includes(role))) throw new CustomException(ErrorCode.ERR_11003);
    return true;
  }

}
