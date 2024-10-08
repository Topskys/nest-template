import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import compression from 'compression';
import { LoggerService } from './shared/logger/logger.service';
import { swagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await swagger(app);
  app.enableCors();
  app.use(helmet());
  app.use(compression()); // gzip
  app.useLogger(app.get(LoggerService));
  await app.listen(process.env.PORT, () =>
    Logger.log(`Server is running on ${process.env.PORT}`, 'NestApplication'),
  );
}
bootstrap();
