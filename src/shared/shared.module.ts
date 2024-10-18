import {
  BadRequestException,
  Logger,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { SharedService } from './shared.service';
import { AnyExceptionFilter } from '@/common/filters';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from '@/common/guards';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggerService } from './logger/logger.service';
import { SqLoggerService } from './logger/sqLogger.service';
import { LoggerInterceptor } from '@/common/interceptors/logger.interceptor';
import { RecordModule } from '@/modules/record/record.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { getDatabaseConfig } from '@/config';

/**
 * 公共模块
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getDatabaseConfig(configService);
      },
    }),
    // 限速节流
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('RATE_TTL'), // 60秒，单位为毫秒
          limit: configService.get<number>('RATE_LIMIT'), // 每60秒最多600个请求
        },
      ],
    }),
    // 操作记录模块
    RecordModule,
    /**
     * 全局缓存
     * TODO：修改缓存方式
     * FIXME：当指定store为redisStore时，会报错，暂不修改
     */
    CacheModule.register({
      isGlobal: true,
      ttl: 24 * 60 * 60 * 1000, // 1d 缓存时间，v5单位为毫秒
    }),
  ],
  providers: [
    SharedService,
    RedisService, // 能够在全局使用（拦截器）
    LoggerService, // 全局日志服务类
    SqLoggerService,
    {
      // 连接redis客户端
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const redisClient = createClient({
          url: configService.get<string>('REDIS_URL'),
        });
        redisClient.on('connect', () => Logger.log('Redis Client Connected'));
        redisClient.on('error', (err) => {
          Logger.error('Redis Client Error', err);
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
    {
      // 全局拦截器
      // 在拦截器中注入服务类的两种方式
      // 01 在使用拦截器的模块中注入服务类和实体（或该服务模块）
      // 02 在main.ts中注册拦截器并注入服务类，如：
      // app.useGlobalInterceptors(new LoggerInterceptor(app.get(RecordService)));
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
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
          Logger.error(`Validation failed：${JSON.stringify(errors)}`); // 日志文件没有记录
          throw new BadRequestException(errorMessage);
        },
      }),
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
    {
      // 全局缓存拦截器
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [SharedService, RedisService, LoggerService, SqLoggerService],
})
export class SharedModule {}
