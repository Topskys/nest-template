import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import logger from '@/utils/log4js';

/**
 * 异常过滤器，捕获所有异常，统一响应
 */
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse?.();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    logger('error').error(exception);

    // 异常消息
    const message = exception?.message
      ? exception.message
      : 'Internal Server Error';

    response.status(status).json({
      code: status,
      message,
      timeStamp: new Date().toISOString(),
    });
  }
}
