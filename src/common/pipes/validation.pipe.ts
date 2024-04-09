import log4js from '@/utils/log4js';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/**
 * 自定义效验器（暂不使用）
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    // 如果没有传入规则，则不验证，返回数据
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 将Json对象转换成类对象并验证
    const classObject = plainToClass(metatype, value);
    const errors = await validate(classObject);
    if (errors.length > 0) {
      // 取出第一个错误信息并抛出错误
      // const error = errors?.shift()?.constraints;
      // const errorMessage = error[Object.keys(error)[0]];
      const errorMessage = Object.values(errors[0].constraints)[0];
      log4js('error').error(`Validation failed：${JSON.stringify(errors)}`);
      throw new BadRequestException(errorMessage);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
