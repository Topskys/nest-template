import { Body, Controller, Get, Header, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import type { Response } from 'express';
import { LoginDto } from './login.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Result } from '@/utils/Result';
import { LOGOUT_SUCCESS } from '@/constants';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Req() req: any, @Body() loginDto: LoginDto) {
    const { captcha } = loginDto;
    // 效验验证码
    if (req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
      throw new CustomException(ErrorCode.ERR_10003);
    }
    // 登录
    return this.authService.login(req.user, loginDto);
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
    req.session.code = captcha.text || '';
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

}
