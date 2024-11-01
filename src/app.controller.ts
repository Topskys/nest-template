import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable } from 'rxjs';
import { Log } from './common/decorators';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  // private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get('/test')
  getHello() {
    // this.logger.log('内置日志模块 test route log');
    this.logger.info('Pino日志模块');
    return this.appService.getHello();
  }

  @Log('SSE')
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((_) => {
        return new MessageEvent('ping', {
          data: { hello: 'sse' },
        });
      }),
    );
  }
}
