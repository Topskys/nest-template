import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly cache:Cache) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
