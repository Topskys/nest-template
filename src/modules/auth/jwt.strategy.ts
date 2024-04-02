import { RedisService } from "@/shared/redis/redis.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { CustomException, ErrorCode } from "@/common/exceptions/custom.exception";
import { ACCESS_TOKEN_EXPIRES_IN } from "@/constants/redis.constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        protected configService: ConfigService,
        private redisService: RedisService,
        private userService: UserService,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_SECRET"),
            ignoreExpiration: false,
            passReqToCallback: true,
        })
    }

    async validate(req, payload: any) {
        const { userId } = payload;

        // 检查用户名是否可用
        // const user = await this.userService.findByUsername(payload.username);
        // if (!user.enable) {
        //     throw new CustomException(ErrorCode.ERR_11007)
        // }
        // // 检查用户有是否可用的角色
        // if (!user.roles?.some((item) => item.enable)) {
        //     throw new CustomException(ErrorCode.ERR_11003)
        // }

        // 从请求头取出访问令牌
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        // 从Redis中取出访问令牌
        const redisAccessToken = await this.redisService.get(userId);

        // 如果Redis中没有访问令牌，则表示该用户未登录，返回错误信息
        if (accessToken !== redisAccessToken) {
            this.redisService.del(userId);
            throw new HttpException(ErrorCode.ERR_11002, HttpStatus.UNAUTHORIZED);
        }

        // 延长访问令牌的有效期（也可以使用双token或通过过期时间刷新方案）
        this.redisService.set(userId, accessToken, ACCESS_TOKEN_EXPIRES_IN);

        return {
            userId: payload.userId,
            username: payload.username,
            roleCodes: payload.roleCodes || [],
            captcha: payload.captcha,
        }
    }
}