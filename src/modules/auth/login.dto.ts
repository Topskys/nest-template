import { IsNotEmpty } from 'class-validator';

/**
 * 登录数据流通对象
 */
export class LoginDto {
    /**
     * 用户名
     */
    @IsNotEmpty({ message: "用户名不能为空" })
    username: string;
    /**
     * 登录密码
     */
    @IsNotEmpty({ message: "密码不能为空" })
    password: string;
    /**
     * 验证码
     */
    @IsNotEmpty({ message: "验证码不能为空" })
    captcha: string;
}