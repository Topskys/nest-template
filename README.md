# Nestjs + TypeScript + TypeOrm + MySQL + Redis
> 2024年4月11日14:48:04

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


## License

Nest is [MIT licensed](LICENSE).


### 报错
在公共模块SharedModule的imports[]数组中使用TypeOrmModule.forRootAsync连接数据库时，在后续业务模块controller的方法中，出现拿不到@Req和@Res对象，打印为空的错误


## Node设置环境变量
Windows下设置环境变量命令：
```sh
SET PORT=8000 && SET NODE_ENV=production # && node ./ncc-dist/index.js
```