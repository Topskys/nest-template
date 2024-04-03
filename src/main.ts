import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'isme',
    name: 'isme.session',
    rolling: true,
    cookie: { maxAge: 1000 },
    resave: false,
    saveUninitialized: true,
  }))
  app.use(cookieParser("cookie_secret"))
  await app.listen(process.env.PORT);
}
bootstrap();
