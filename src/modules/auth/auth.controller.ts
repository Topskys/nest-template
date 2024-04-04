import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import type { Response } from 'express';
import { LoginDto } from './login.dto';
import { Result } from '@/utils/Result';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '@/constants';
import { LocalGuard } from '@/common/guards/local.guard';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  CAPTCHA_EXPIRES_IN,
  CAPTCHA_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
} from '@/constants/redis.constant';
import {
  CustomException,
  ErrorCode,
} from '@/common/exceptions/custom.exception';
import { Public } from '@/common/decorators/public.decorator';
import { RedisService } from '@/shared/redis/redis.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  getCaptchaKey(captchaText: string) {
    return `${CAPTCHA_KEY}:${captchaText}`;
  }

  @Public()
  @UseGuards(LocalGuard) // 会将当前请求的user对象挂载到request上
  @Post('login')
  async login(@Req() req: any, @Body() loginDto: LoginDto) {
    const { captcha } = loginDto;
    // 判断验证码
    const redisCaptcha = await this.redisService.get(
      this.getCaptchaKey(captcha),
    );
    if (redisCaptcha !== captcha?.toLowerCase()) {
      throw new CustomException(ErrorCode.ERR_10003);
    }
    // 执行登录
    const tokens = await this.authService.login(req.user);
    return Result.ok(tokens, LOGIN_SUCCESS);
  }

  /**
   * 生成图片验证码
   * @param res 响应体
   */
  @Public()
  @Get('captcha')
  async createCaptcha(@Res() res: Response) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    });
    const captchaText = captcha.text?.toLowerCase();
    await this.redisService.set(
      this.getCaptchaKey(captchaText),
      captchaText,
      CAPTCHA_EXPIRES_IN,
    );
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('logout')
  async logout(@Req() req: any) {
    if (await this.authService.logout(req.user)) {
      return Result.ok(undefined, LOGOUT_SUCCESS);
    }
    return Result.error();
  }

  /**
   * 获取菜单路由
   */
  @Get('route')
  async getRouteTree() {
    const routerTree = await this.authService.findMenu();
    return Result.ok(routerTree);
  }

  /**
   * 获取当前登录用户的个人信息
   */
  @Get('profile')
  async getUserInfo(@Req() req: any) {
    const { user: userInfo } = req;
    return Result.ok(userInfo);
  }
}
