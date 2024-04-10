import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DecoratorEnum } from '@/constants';
import { RecordService } from '@/modules/record/record.service';

/**
 * 记录日志拦截器
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly recordService: RecordService) { }

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // console.log('Before...');
    const startTime = Date.now();
    const req = ctx.switchToHttp().getRequest();
    // 获取日志打印参数
    const isPrint = Reflect.getMetadata(
      DecoratorEnum.LOG_PRINT,
      ctx.getHandler(),
    );
    const message = Reflect.getMetadata(
      DecoratorEnum.LOG_MESSAGE,
      ctx.getHandler(),
    );
    return next.handle().pipe(
      // console.log('After...');
      tap(async () => {
        // 是否打印日志
        const { query, params, body, path } = req;
        const ignoreRoutes = process.env.LOG_IGNORE_ROUTES?.split(',');
        if (isPrint === undefined || ignoreRoutes?.includes(path)) return;
        if (isPrint) Logger.log(`${message}`);
        // 记录日志
        const record: any = {
          ip: req.ip,
          method: req.method,
          path: path || req.originalUrl,
          params: JSON.stringify({ ...query, ...params, ...body }),
          module: ctx.getClass()['name'],
          action: ctx.getHandler()['name'],
          description: message,
          costTime: Date.now() - startTime,
        };
        await this.recordService.create(req, record);
      }),
      // 捕捉异常
      // catchError((err) => {}),
      // 响应映射，不适用于特定于库的响应策略（直接使用@Res()对象是禁止的）
      // map((res) => {})
    );
  }
}
