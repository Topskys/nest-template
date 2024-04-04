import { HttpException, HttpStatus } from '@nestjs/common';
import { ERR, ErrInfo } from './error-code';

/**
 * 自定义异常类
 */
export class CustomException extends HttpException {
  protected code: number;

  constructor(err: ErrInfo, message?: string, status?: HttpStatus) {
    message = message ?? err.message ?? String(err.code);
    super(message, status ?? HttpStatus.BAD_REQUEST);
    this.code = err.code;
  }
}

export { ERR as ErrorCode };
