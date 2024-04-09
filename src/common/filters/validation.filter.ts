import { Result } from '@/utils/Result';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * 捕捉参数效验错误（暂不使用）
 */
@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    // TODO: 记录错误
    console.log('------------ValidationError-----------', exception);
    const errors = JSON.stringify(this.formatErrors(response) || '');
    response
      .status(HttpStatus.BAD_REQUEST)
      .json(Result.error(errors, HttpStatus.BAD_REQUEST));
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map((error) => {
      for (const property in error.constraints) {
        if (error.constraints.hasOwnProperty(property)) {
          return error.constraints[property];
        }
      }
    });
  }
}
