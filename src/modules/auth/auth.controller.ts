import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import type { Response } from 'express';
import { LoginDto } from './login.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Result } from '@/utils/Result';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '@/constants';
import { LocalGuard } from '@/common/guards/local.guard';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '@/constants/redis.constant';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalGuard) // 会将当前请求的user对象挂载到request上
  @Post('login')
  async login(@Req() req: any, @Res() res: Response, @Body() loginDto: LoginDto) {
    const { captcha } = loginDto;
    // 效验验证码
    if (req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
      throw new CustomException(ErrorCode.ERR_10003);
    }
    // 执行登录
    const { accessToken, refreshToken } = await this.authService.login(req.user);
    // 设置cookie
    res.cookie('Authorization', accessToken, { maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000, signed: true, httpOnly: true });
    res.cookie('RefreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000, signed: true, httpOnly: true });
    // 返回结果
    res.send(Result.ok({ accessToken, refreshToken }, LOGIN_SUCCESS));
  }

  /**
   * 生成图片验证码
   * @param req 请求体
   * @param res 响应体
   */
  @Get('captcha')
  async createCaptcha(@Req() req: any, @Res() res: Response) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 40,
      background: '#fff',
      color: true,
    });
    req.session.captcha = captcha.text || '';
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: any) {
    if (await this.authService.logout(req.user)) {
      return Result.ok(undefined, LOGOUT_SUCCESS)
    }
    return Result.error()
  }

  /**
   * 获取菜单路由
   */
  @Get("route")
  async getRouteTree() {
    const routerTree = await this.authService.findMenu();
    return Result.ok(routerTree);
  }

  /**
   * 获取当前登录用户的个人信息
   */
  @Get('profile')
  async getUserInfo(@Req() req: any) {
    const userInfo = req.user
    if (userInfo) return Result.ok(userInfo);
    return Result.error("获取用户信息失败");
  }

}
