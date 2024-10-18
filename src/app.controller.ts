import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable } from 'rxjs';
import { Log } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getHello() {
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
