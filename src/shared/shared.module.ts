import { Module, ValidationPipe } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { SharedService } from './shared.service';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { AllExceptionFilter } from '@/common/filters/all-exception.filter';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

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
          synchronize: process.env.NODE_ENV === 'development',
          timezone: '+08:00',
          // logging: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
      useFactory: (configService: ConfigService) => ([{
        ttl: configService.get<number>('RATE_TTL'), // 60秒，单位为毫秒
        limit: configService.get<number>('RATE_LIMIT') // 每60秒最多100个请求
      }])
    }),
    // 日志模块

  ],
  providers: [
    SharedService,
    RedisService,
    {
      // 连接redis客户端
      inject: [ConfigService],
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const redisClient = createClient({
          url: configService.get<string>('REDIS_URL'),
        });
        redisClient.on('connect', () => console.log('Redis Client Connected'));
        redisClient.on('error', (err) =>
          console.log('Redis Client Error', err),
        );
        await redisClient.connect();
        return redisClient;
      },
    },
    {
      // 全局错误过滤器
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    // 好像不起作用
    // { 
    //   provide: 'APP_FILTER',
    //   useClass: TypeOrmFilter,
    // },
    // {
    //   provide: 'APP_FILTER',
    //   useClass: ValidationFilter,
    // },
    {
      // 全局拦截器
      provide: 'APP_INTERCEPTOR',
      useClass: TransformInterceptor,
    },
    {
      // 全局管道参数效验
      provide: 'APP_PIPE',
      useValue: new ValidationPipe({
        whitelist: true, // 删除不在类上存在的字段
        transform: true, // 自动类型转换
      }),
    },
    {
      // 全局JWT守卫
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
    {
      // 全局节流
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    }
  ],
  exports: [SharedService, RedisService],
})
export class SharedModule { }
