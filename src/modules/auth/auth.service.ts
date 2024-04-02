import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { RedisService } from '@/shared/redis/redis.service';
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_KEY } from '@/constants/redis.constant';

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private redisService: RedisService,
        private userService: UserService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
        if (user && compareSync(password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    getAccessTokenKey(payload: any) {
        return `${ACCESS_TOKEN_KEY}:${payload.userId}`
    }

    async login(user: any, res: any, captcha?: string) {
        // 判断用户角色enable属性是否有为true
        // 判断用户的各种状态
        if (!user.roles?.some(r => r.enable)) {
            throw new CustomException(ErrorCode.ERR_11003)
        }
        const roleCodes = user?.roles.map(r => r.code);
        const payload = { id: user.id, roleCodes, username: user.username };
        return this.generateToken(payload);
    }

    generateToken(payload: any) {
        const accessToken = this.jwtService.sign(payload);
        this.redisService.set(this.getAccessTokenKey(payload), accessToken, ACCESS_TOKEN_EXPIRES_IN)
        return accessToken;
    }
}
