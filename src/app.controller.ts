import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from '@nestjs/cache-manager';
import { interval, map, Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cache: Cache,
  ) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => {
      return new MessageEvent('ping', {
        data: { hello: 'sse' }
      })
    }));
  }

}
