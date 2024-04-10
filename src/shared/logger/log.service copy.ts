import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import getLogger from '@/utils/log4js';
import { Logger } from 'log4js';

/**
 * 自定义日志服务类（暂不使用）
 * 01 app.useLogger(app.get(LogService));
 * 02 Logger.info(message)
 */
@Injectable()
export class LogService implements LoggerService {
  private logger: (category?: string) => Logger = getLogger;

  log(message: any, ...optionalParams: any[]) {
    this.logger().info(message);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger('error').error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger().warn(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger().debug(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger().info(message);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    this.logger().fatal(message);
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
