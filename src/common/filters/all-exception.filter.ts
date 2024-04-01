import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exceptionResponse = exception.getResponse?.();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      code: exception.code ?? status, // 如果 exception.code 是 null 或 undefined，则将返回 status的值，否则返回exception.code的值。
      error: exception.name,
      message: exceptionResponse?.message || exception.message,
      originUrl: request.originalUrl,
    });
  }
}
