import { ProfileDto } from '../user/dto/create-user.dto';
import { RedisService } from '@/shared/redis/redis.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { AuthService } from './auth.service';
import { ProfileVo } from '@/vo/profile.vo';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected configService: ConfigService,
    private redisService: RedisService,
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const { id, username, roleCodes } = payload; // jwt payload
    const accessTokenKey = this.authService.getAccessTokenKey({ id });
    const refreshTokenKey = this.authService.getRefreshTokenKey({ id });
    // 检查用户名是否可用
    const user = await this.userService.findByUsername(username);
    if (!user) throw new BadRequestException('用户不存在');
    if (!user?.enable) throw new BadRequestException('用户已被禁用');

    // 检查用户有是否可用的角色
    if (!user.roles?.some((item) => item.enable))
      throw new ForbiddenException('请先分配角色');

    // 分别从请求头和Redis取出令牌
    const authorization = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const redisAuthorization = await this.redisService.get(accessTokenKey);
    const redisRefreshToken = await this.redisService.get(refreshTokenKey);
    // 如果Redis中没有访问令牌，则表示该用户未登录，返回错误信息
    if (![redisAuthorization, redisRefreshToken].includes(authorization)) {
      await this.redisService.del(accessTokenKey);
      await this.redisService.del(refreshTokenKey);
      throw new UnauthorizedException();
    }

    // 延长令牌的有效期（也可以使用双token或通过过期时间刷新方案）
    // this.redisService.set(accessTokenKey, authorization, ACCESS_TOKEN_EXPIRES_IN);
    // 查询角色对应按钮权限
    const roleIds = user.roles?.map((item) => item.id);
    const permissions = await this.roleService.findButtonPermissionsByRoleIds(
      roleIds,
    );
    // 返回当前登录账号信息，供下文使用
    user.roles = roleCodes;
    return new ProfileVo({ ...user, permissions });
  }
}
