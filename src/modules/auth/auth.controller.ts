import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import type { Response } from 'express';
import { LoginDto } from './login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Req() req: any, @Body() loginDto: LoginDto) {
    const { captcha, ...res } = loginDto;
    // 效验验证码
    if (req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
      throw new CustomException(ErrorCode.ERR_10003);
    }
    // 登录
    // return this.authService.login(req.user, res,req.session?.captcha);
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

}
