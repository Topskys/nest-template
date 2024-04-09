import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { SharedService } from './shared.service';
import { AnyExceptionFilter } from '@/common/filters/any-exception.filter';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { join } from 'path';
import { isDev } from '@/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import log4js from '@/utils/log4js';
import { LogService } from './logger/log.service';
import { SqLoggerService } from './logger/sqLogger.service';

/**
 * 公共模块
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          autoLoadEntities: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: isDev,
          timezone: '+08:00',
          logging: isDev ? 'all' : ['error'],
          logger: new SqLoggerService(),
          entities: isDev ? [__dirname + '/../**/*.entity{.ts,.js}'] : [],
        };
      },
    }),
    // 静态文件服务模块
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          serveRoot: configService.get('STATIC_PREFIX'),
          rootPath: join(process.cwd(), configService.get('STATIC_PATH')),
        },
      ],
    }),
    // 限速节流
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('RATE_TTL'), // 60秒，单位为毫秒
          limit: configService.get<number>('RATE_LIMIT'), // 每60秒最多100个请求
        },
      ],
    }),
  ],
  providers: [
    SharedService,
    RedisService, // 能够在全局使用（拦截器）
    LogService, // 全局日志服务类
    SqLoggerService,
    {
      // 连接redis客户端
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const redisClient = createClient({
          url: configService.get<string>('REDIS_URL'),
        });
        redisClient.on('connect', () => log4js().info('Redis Client Connected'));
        redisClient.on('error', (err) => {
          log4js('error').error('Redis Client Error', err);
        });
        await redisClient.connect();
        return redisClient;
      },
    },
    {
      // 全局异常过滤器
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    // {
    //   // 全局拦截器
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggerInterceptor,
    // },
    {
      // 全局管道参数效验
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // 删除不在类上存在的字段
        transform: true, // 自动类型转换
        // forbidNonWhitelisted: true, // 禁止非白名单字段
        exceptionFactory: (errors) => {
          // 取出第一个错误信息并抛出错误
          const errorMessage = Object.values(errors[0].constraints)[0];
          log4js('error').error(`Validation failed：${JSON.stringify(errors)}`);
          throw new BadRequestException(errorMessage);
        },
      }),
      // 自定以管道效验器
      // useClass: ValidationPipe,
    },
    {
      // 全局JWT守卫
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      // 全局节流
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [SharedService, RedisService, LogService, SqLoggerService],
})
export class SharedModule { }
