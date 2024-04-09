import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DecoratorEnum } from '@/constants';
import { RecordService } from '@/modules/record/record.service';

/**
 * 记录日志拦截器
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly recordService: RecordService){}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const startTime = Date.now();
    // 获取请求体和响应体
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();
    // 获取日志打印参数
    const isPrint = Reflect.getMetadata(DecoratorEnum.LOG_PRINT, context.getHandler());
    const message = Reflect.getMetadata(DecoratorEnum.LOG_MESSAGE, context.getHandler());
    // TODO：记录日志（ip 城市 名称 路径 方法 参数 耗时 时间）
    const { ip, method, path, route, originalUrl, query, param, body } = req;
    console.log('---------------LoggerInterceptor--------------------',isPrint,message);
    const record = { ip, method, path: originalUrl, query, param, body, ms:0 };
    await this.recordService.create(req, record);
    return next.handle();
  }
}
