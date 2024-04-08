import * as Log4js from 'log4js';
import config from './log4js.config';
import { Logger, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

Log4js.configure(config);

/**
 * 自定TypeOrm日志类
 */
@Injectable()
export class SQLLogger implements Logger {
    constructor(private logger = Log4js) { }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.getLogger().info(`[QUERY]: ${query}`);
    }

    logQueryError(
        error: string | Error,
        query: string,
        parameters?: any[],
        queryRunner?: QueryRunner,
    ) {
        this.logger.getLogger('error').error(`[QUERY]: ${query} [ERROR]：${error}`);
    }

    logQuerySlow(
        time: number,
        query: string,
        parameters?: any[],
        queryRunner?: QueryRunner,
    ) {
        this.logger.getLogger().info(`[QUERY]: ${query} [TIME]：${time}`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logger.getLogger().info(`[SCHEMA BUILD]: ${message}`);
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.getLogger().info(`[SCHEMA BUILD]: ${message}`);
    }

    log(level: 'info' | 'log' | 'warn', message: any, queryRunner?: QueryRunner) {
        switch (level) {
            case 'log':
                this.logger.getLogger().debug(`[LOG]: ${message}`);
                break;
            case 'info':
                this.logger.getLogger().info(`[INFO]: ${message}`);
                break;
            case 'warn':
                this.logger.getLogger().warn(`[WARN]: ${message}`);
                break;
        }
    }
}


export default Log4js.getLogger;
