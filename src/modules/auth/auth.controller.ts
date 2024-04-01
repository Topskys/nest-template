import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @Post('login')
  // async login(@Req() req: any, @Body() body: any) {
  //   // 判断验证码是否正确
  //   if (req.session?.code?.toLowerCase() !== body.captcha?.toLowerCase()) {
  //     throw new CustomException(ErrorCode.ERR_10003);
  //   }
  //   // 其余登录逻辑
  //   return this.authService.login();
  // }

}
