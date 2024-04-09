import { Injectable } from '@nestjs/common';
import getLogger from '@/utils/log4js';
import { QueryRunner, Logger as TypeOrmLogger } from 'typeorm';
import { Logger } from 'log4js';

/**
 * 自定义TypeOrm日志类
 */
@Injectable()
export class SqLoggerService implements TypeOrmLogger {
  private logger: (category?: string) => Logger = getLogger;

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger().info(`[QUERY]: ${query}`);
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger('error').error(`[QUERY]: ${query} [ERROR]：${error}`);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger().info(`[QUERY]: ${query} [TIME]：${time}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger().info(`[SCHEMA BUILD]: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger().info(`[SCHEMA BUILD]: ${message}`);
  }

  log(level: 'info' | 'log' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        this.logger().debug(`[LOG]: ${message}`);
        break;
      case 'info':
        this.logger().info(`[INFO]: ${message}`);
        break;
      case 'warn':
        this.logger().warn(`[WARN]: ${message}`);
        break;
    }
  }
}
