import { SetMetadata } from '@nestjs/common';
import { DecoratorEnum } from '@/constants/decorator.constant';

/**
 * 跳过登录验证装饰器
 * SkipAuth or AllowAnon
 */
export const Public = () => SetMetadata(DecoratorEnum.IS_PUBLIC, true);
