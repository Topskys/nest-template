import { isDev } from '@/utils';
import { DecoratorEnum } from '@/constants/decorator.constant';
import { SetMetadata, applyDecorators } from '@nestjs/common';

/**
 * 记录日志装饰器
 * @param message 消息（或描述）可用于承载错误文件的位置（stacktrace-js）
 * @param isPrint 是否打印日志，默认为（development ? true:false）
 * TODO：
 */
export const Log = (message?: string, isPrint: boolean = isDev) =>
  applyDecorators(
    SetMetadata(DecoratorEnum.LOG_MESSAGE, message),
    SetMetadata(DecoratorEnum.LOG_PRINT, isPrint),
  );
