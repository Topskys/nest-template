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
          logging: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
    }),
    ServeStaticModule.forRoot({
      serveRoot: process.env.STATIC_PREFIX,
      rootPath: join(process.cwd(), process.env.STATIC_PATH),
    }),
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
    {
      // 全局拦截器
      provide: 'APP_INTERCEPTOR',
      useClass: TransformInterceptor,
    },
    {
      // 全局参数校验管道
      provide: 'APP_PIPE',
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true, // 自动类型转换
      }),
    },
    {
      // 全局JWT守卫
      provide: 'APP_GUARD',
      useClass: JwtGuard,
    },
  ],
  exports: [SharedService, RedisService],
})
export class SharedModule { }
