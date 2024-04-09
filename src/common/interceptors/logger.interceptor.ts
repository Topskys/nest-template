import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DecoratorEnum } from '@/constants';

/**
 * 记录日志拦截器
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();
    const isPrint = Reflect.getMetadata(DecoratorEnum.LOG_PRINT, [
      context.getHandler(),
      context.getClass(),
    ]);
    const message = Reflect.getMetadata(DecoratorEnum.LOG_MESSAGE, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { ip, method, path, route, originalUrl, query, param, body } = req;
    console.log(message, isPrint, context);
    // TODO：记录日志（ip 城市 名称 路径 方法 参数 耗时 时间）
    return next.handle();
  }
}
