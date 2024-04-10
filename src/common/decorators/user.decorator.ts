import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * 获取请求中的用户信息参数装饰器（登录后）
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
