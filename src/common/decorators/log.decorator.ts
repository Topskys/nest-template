import { SetMetadata } from "@nestjs/common";

/**
 * 记录日志装饰器
 * @param name 操作名称
 */
export const Log = (name?: string) => SetMetadata('log', name);