import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { RedisService } from '@/shared/redis/redis.service';
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_KEY } from '@/constants/redis.constant';
import { LoginDto } from './login.dto';

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

    async login(user: any, loginDto: LoginDto) {
        // 判断用户角色enable属性是否有为true
        // 判断用户的各种状态
        if (!user.roles?.some(r => r.enable)) {
            throw new CustomException(ErrorCode.ERR_11003)
        }
        const roleCodes = user?.roles.map(r => r.code);
        const payload = { id: user.id, roleCodes, username: user.username };
        return this.generateToken(payload);
    }

    /**
     * 生成令牌
     */
    generateToken(payload: any) {
        const accessToken = this.jwtService.sign(payload);
        this.redisService.set(this.getAccessTokenKey(payload), accessToken, ACCESS_TOKEN_EXPIRES_IN)
        return accessToken;
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

}
