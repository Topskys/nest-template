import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import logger from '@/utils/log4'

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

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    logger("error").error(exception);

    response.status(status).json({
      code: exception.code ?? status, // 如果 exception.code 是 null 或 undefined，则将返回 status的值，否则返回exception.code的值。
      error: exception.name,
      message: exceptRes?.message || exception.message || 'Internal Server Error',
      originUrl: `${request.method} ${request.originalUrl}`,
      timeStamp: new Date().toISOString(),
    });
  }
}
