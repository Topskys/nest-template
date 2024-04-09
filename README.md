<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Document

[中文文档](https://nest.nodejs.cn)

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


### 报错
在公共模块SharedModule的imports[]数组中使用TypeOrmModule.forRootAsync连接数据库时，在后续业务模块controller的方法中，出现拿不到@Req和@Res对象，打印为空的错误

```ts
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
                    entities: [__dirname + '/../**/*.entity{.ts,.js}']
                }
            }
        }),
    ],
    providers: [
        SharedService,
        RedisService,
        {
            // 连接redis客户端
            inject: [ConfigService],
            provide: "REDIS_CLIENT",
            async useFactory(configService: ConfigService) {
                const redisClient = createClient({
                    url: configService.get<string>("REDIS_URL")
                });
                redisClient.on("connect", () => console.log("Redis Client Connected"));
                redisClient.on("error", (err) => console.log("Redis Client Error", err));
                await redisClient.connect();
                return redisClient;
            }
        },
    ],
    exports: [SharedService, RedisService],
})
export class SharedModule { }
```

```ts
// 业务模块controller
import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('captcha')
  async createCaptcha(@Req() req: any, @Res() res: Response) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    });
    console.log('-----', res, req) // ------ undefined undefined
    req.session.code = captcha.text || '';
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

}
```

## Node设置环境变量
Windows下设置环境变量命令：
```sh
SET PORT=8000 && SET NODE_ENV=production # && node ./ncc-dist/index.js
```