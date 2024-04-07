import { SharedService } from '@/shared/shared.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import type { Response } from 'express';
import { LoginDto } from './login.dto';
import { Result } from '@/utils/Result';
import { EDIT_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS } from '@/constants';
import { LocalGuard } from '@/common/guards';
import { CAPTCHA_EXPIRES_IN, CAPTCHA_KEY } from '@/constants/redis.constant';
import {
  CustomException,
  ErrorCode,
} from '@/common/exceptions/custom.exception';
import { Public } from '@/common/decorators/public.decorator';
import { RedisService } from '@/shared/redis/redis.service';
import { UpdatePasswordDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { PermissionService } from '../permission/permission.service';
import { Meta, RouterVo } from '@/vo/router.vo';
import { Logger } from 'nestjs-pino'

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly logger: Logger,
  ) { }

  getCaptchaKey(captchaText: string) {
    return `${CAPTCHA_KEY}:${captchaText}`;
  }

  @Public()
  @UseGuards(LocalGuard) // 会将当前请求的user对象挂载到request上
  @Post('login')
  async login(@Req() req: any, @Body() loginDto: LoginDto) {
    const { captcha } = loginDto;
    // 判断验证码
    const redisCaptcha = await this.redisService.get(this.getCaptchaKey(captcha));
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
    const menus = await this.permissionService.findMenuRoute();
    if (!menus.length)
      throw new HttpException('暂无菜单', HttpStatus.NOT_FOUND);
    const routes = menus.map((item) => {
      const routerVo = new RouterVo(item);
      routerVo.meta = new Meta(item);
      return routerVo;
    });
    return Result.ok(SharedService.handleTree(routes));
  }

  /**
   * 获取当前登录用户的个人信息
   */
  @Get('profile')
  async getUserInfo(@Req() req: any) {
    const { user: userInfo } = req;
    return Result.ok(userInfo);
  }

  /**
   * 重置当前账号的密码
   * @param req 请求
   * @param body 请求体
   */
  @Post('reset-password')
  async changePassword(@Req() req: any, @Body() body: UpdatePasswordDto) {
    const { id } = req.user;
    const { password } = body;
    await this.userService.resetPassword(id, password);
    await this.authService.logout(req);
    return Result.ok(undefined, EDIT_SUCCESS);
  }
}
