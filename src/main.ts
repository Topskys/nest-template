import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import * as compression from 'compression';
import { LoggerService } from './shared/logger/logger.service';
import { swagger } from './utils/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      // 暴露给客户端的响应头
      exposedHeaders: ['Authorization', 'RefreshToken'],
    },
  });
  app.setGlobalPrefix('/api');
  // 设置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/', // 设置虚拟前缀路径
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  // 阻止XSS
  app.use(helmet());
  // 压缩响应gzip
  app.use(compression());
  app.useLogger(app.get(LoggerService));
  await swagger(app);
  // 开启服务监听并打印日志
  await app.listen(process.env.PORT);
  Logger.log(`Server is running on ${process.env.PORT}`, 'NestApplication');
}
bootstrap();
