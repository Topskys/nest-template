import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import {
  CustomException,
  ErrorCode,
} from '@/common/exceptions/custom.exception';
import { RedisService } from '@/shared/redis/redis.service';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_KEY,
} from '@/constants/redis.constant';
import { LoginDto } from './login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../permission/entities/permission.entity';
import { Repository } from 'typeorm';
import { SharedService } from '@/shared/shared.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private userService: UserService,
    private readonly sharedService: SharedService,
    @InjectRepository(Permission) private permissionRep: Repository<Permission>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user && compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  getAccessTokenKey(payload: any) {
    return `${ACCESS_TOKEN_KEY}:${payload.id}`;
  }

  getRefreshTokenKey(payload: any) {
    return `${REFRESH_TOKEN_KEY}:${payload.id}`;
  }

  async login(user: any) {
    // 判断用户角色enable属性是否有为true
    if (!user.enable) throw new CustomException(ErrorCode.ERR_10005);
    // 判断用户的各种状态
    if (!user.roles?.some((r) => r.enable)) {
      throw new CustomException(ErrorCode.ERR_11003);
    }
    const roleCodes = user?.roles.map((r) => r.code);
    // 生成双token
    const payload = { id: user.id, roleCodes, username: user.username };
    const accessToken = this.generateToken(
      payload,
      this.getAccessTokenKey(payload),
      ACCESS_TOKEN_EXPIRES_IN,
    );
    const refreshToken = this.generateToken(
      payload,
      this.getRefreshTokenKey(payload),
      REFRESH_TOKEN_EXPIRES_IN,
    );
    return { accessToken, refreshToken };
  }

  /**
   * 生成令牌
   */
  generateToken(payload: any, key: string, ttl?: number) {
    const jwtToken = this.jwtService.sign(payload);
    this.redisService.set(key, jwtToken, ttl);
    return jwtToken;
  }

  /**
   * 退出登录
   * @param user
   * @returns
   */
  async logout(user: any) {
    // 删除当前用户相关信息
    if (user.userId) {
      await this.redisService.del(this.getAccessTokenKey(user));
      return true;
    }
    return false;
  }

  /**
   * 查询菜单并构建菜单树
   */
  async findMenu() {
    const menuList = await this.permissionRep.find({
      where: {
        type: 'MENU',
        enable: true,
        isDeleted: false,
      },
      order: {
        order: 'ASC',
      },
    });
    // 构建菜单树
    return this.sharedService.generateRouter(menuList, '');
  }

  async refreshToken(user: any) {}
}
