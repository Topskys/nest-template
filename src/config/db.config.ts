import { SqLoggerService } from '@/shared/logger/sqLogger.service';
import { isDev } from '@/utils';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 数据库配置
 *
 * @param configService 全局配置服务
 * @returns
 */
export function getDatabaseConfig(
  configService: ConfigService,
): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
  return {
    type: 'mysql',
    autoLoadEntities: true,
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    synchronize: isDev,
    timezone: '+08:00',
    logging: isDev ? 'all' : ['error'],
    logger: new SqLoggerService(),
    entities: isDev ? [__dirname + '/../**/*.entity{.ts,.js}'] : [],
  };
}
