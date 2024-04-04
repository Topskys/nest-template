import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Role]), // 注入实体
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 导出服务，让其他模块使用
})
export class UserModule {}
