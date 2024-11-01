import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RedisService } from '@/shared/redis/redis.service';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_KEY,
} from '@/constants/redis.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private userService: UserService,
    private readonly configService: ConfigService,
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

  /**
   * 登录
   */
  async login(user: any) {
    // 判断用户角色enable属性是否有为true
    if (!user.enable) throw new BadRequestException('用户已被禁用');
    // 判断用户的各种状态
    if (!user.roles?.some((r) => r.enable)) {
      throw new BadRequestException('用户无角色');
    }
    const roleCodes = user?.roles.map((r) => r.code);
    // 生成双token
    const payload = { id: user.id, roleCodes, username: user.username }; // Jwt payload
    const accessToken = await this.generateToken(
      payload,
      this.getAccessTokenKey(payload),
      ACCESS_TOKEN_EXPIRES_IN,
    );
    const refreshToken = await this.generateToken(
      payload,
      this.getRefreshTokenKey(payload),
      REFRESH_TOKEN_EXPIRES_IN,
    );
    return { accessToken, refreshToken };
  }

  /**
   * 生成令牌
   */
  async generateToken(payload: any, key: string, ttl?: number) {
    const jwtToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: ttl,
    });
    await this.redisService.set(key, jwtToken, ttl);
    return jwtToken;
  }

  /**
   * 退出登录
   */
  async logout(id: string) {
    // 删除当前用户相关信息
    const key = this.getAccessTokenKey({ id });
    return await this.redisService.del(key);
  }

  /**
   * 刷新令牌
   */
  async refreshToken(user: any) {
    const payload = {
      id: user.id,
      roleCodes: user.roles.map((r) => r.code),
      username: user.username,
    };
    const accessToken = await this.generateToken(
      payload,
      this.getAccessTokenKey(payload),
      ACCESS_TOKEN_EXPIRES_IN,
    );
    const refreshToken = await this.generateToken(
      payload,
      this.getRefreshTokenKey(payload),
      REFRESH_TOKEN_EXPIRES_IN,
    );
    return { accessToken, refreshToken };
  }
}
