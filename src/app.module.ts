import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development','.env'],
    }),
    // 业务模块
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,

    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

