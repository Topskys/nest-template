import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

    constructor(
        // private configServer: ConfigService,
        // private jwtService: JwtService,
        // private redisService: RedisService,
        // private userServer: UserService,
    ) { }

    async login() {
        // 判断用户角色enable属性是否有为true
        // 判断用户的各种状态
    }

    generateToken(payload: any) {
        // const jwtToken = this.jwtService.sign(payload);
        // this.redisServer.set()
        // return jwtToken;
    }
}
