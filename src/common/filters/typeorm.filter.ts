import { Result } from '@/utils/Result';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';

/**
 * 捕捉数据库错误（暂不使用）
 */
@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // TODO: 记录错误
    console.log('------------TypeORMError-----------', exception);
    response
      .status(HttpStatus.OK)
      .json(Result.error(exception.message, HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
