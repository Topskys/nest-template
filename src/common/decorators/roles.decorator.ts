import { SetMetadata } from '@nestjs/common';
import { DecoratorEnum } from '@/constants/decorator.constant';

/**
 * 角色权限效验装饰器
 * @param roles 角色数组
 */
export const Roles = (roles?: string[]) =>
  SetMetadata(DecoratorEnum.ROLES, roles);
