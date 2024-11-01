import { Controller, Get, Logger, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable } from 'rxjs';
import { Log } from './common/decorators';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getHello() {
    this.logger.log('内置日志模块 test route log');
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
