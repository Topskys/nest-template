import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import logger from '@/utils/log4js';

/**
 * 全局异常过滤器
 */
@Catch()
export class AnyExceptionFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exceptRes = exception.getResponse?.();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    logger('error').error(exception);

    response.status(status).json({
      statusCode: status,
      message:
        exceptRes?.message || exception.message || 'Internal Server Error',
      originUrl: `${request.method} ${request.originalUrl}`,
      timeStamp: new Date().toISOString(),
    });
  }
}
