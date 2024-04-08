import Log4js from '@/utils/log4';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { RecordService } from '@/modules/record/record.service';

/**
 * 记录日志中间件
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // record模块导出recordService并在此引用
  constructor(private recordService: RecordService) { }

  async use(req: any, res: any, next: () => void) {
    // TODO: 记录日志（ip 城市 名称 路径 方法 参数 耗时 时间）
    const { ip, method, path, query, param, body } = req;
    const startTime = new Date().getTime();
    await next();
    const ms = new Date().getTime() - startTime; // 耗时
    // 记录日志
    const record = { ip, method, path, query, param, body, ms }
    this.recordService.create(record);
  }
}
