import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import type { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
    console.log('------------------------', res, req)
    req.session.code = captcha.text || '';
    res.type('image/svg+xml');
    res.send(captcha.data);
  }


}
