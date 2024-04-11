import { ConsoleLogger, Injectable } from '@nestjs/common';
import getLogger from '@/utils/log4js';
import { Logger as log4jsLogger } from 'log4js';

/**
 * 继承日志服务类
 * 01 app.useLogger(app.get(LogService));
 * 02 Logger.info(message)
 */
@Injectable()
export class LoggerService extends ConsoleLogger {
  private logger: (category?: string) => log4jsLogger = getLogger;

  constructor() {
    super();
  }

  /**
   * 重写log方法
   * @param message 消息
   * @param args 剩余参数
   */
  log(message: any, ...args: any[]) {
    super.log(message, ...args);
    // 记录日志
    this.logger().info(message, ...args);
  }

  /**
   * 重写error方法
   * @param message 消息
   * @param args 剩余参数
   */
  error(message: any, ...args: any[]) {
    super.error(message, ...args);
    this.logger('error').error(message, ...args);
  }

  // 其他扩展方法...
}
