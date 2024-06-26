// 可参考 https://blog.csdn.net/fwzzzzz/article/details/116160816
import { isDev } from '@/utils';
import { Configuration } from 'log4js';
import * as path from 'path';

// 获取当前工作目录
const LOG_DIR = path.resolve(process.cwd(), 'logs');

const log4jsConfig: Configuration = {
  // 输出日志配置
  appenders: {
    console: {
      type: 'console',
      // 布局参考 https://log4js-node.github.io/log4js-node/layouts.html
    }, // 打印到控制台
    access: {
      type: 'dateFile',
      filename: `${LOG_DIR}/access/access.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd',
      daysToKeep: 14,
      numBackups: 5,
      keepFileExt: true,
      compress: true,
      maxLogSize: 20 * 1024 * 1024, // 单个文件大小为20MB，大小达到20MB时，自动生成新的文件
    },
    // 异常日志
    errorFile: {
      type: 'dateFile',
      filename: `${LOG_DIR}/error/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          "[%d{yyyy-MM-dd hh:mm:ss SSS}] [%p] -h: %h -pid: %z  msg: '%m' ",
      },
      pattern: 'yyyy-MM-dd',
      daysToKeep: 14,
      numBackups: 5,
      keepFileExt: true,
      compress: true,
      maxLogSize: 20 * 1024 * 1024,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      // appenders: isDev ? ['console'] : ['access'],
      appenders: ['access'],
      level: 'info',
    },
    error: {
      // appenders: isDev ? ['console'] : ['errors'],
      appenders: ['errors'],
      level: 'error',
    },
  },
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  // disableClustering: true,
};

export default log4jsConfig;
