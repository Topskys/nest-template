import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { RecordService } from './modules/record/record.service';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalInterceptors(new LoggerInterceptor(app.get(RecordService)));
  await app.listen(process.env.PORT);
}
bootstrap();
