import { PageDto } from "@/modules/page.dto";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ProfileDto } from "./create-user.dto";

export class UserDto {

}

/**
 * 分页查询用户参数流通对象
 */
export class PageUserDto extends PageDto {

    @IsOptional()
    username?: string;

    @IsOptional()
    gender?: number;

    @IsBoolean()
    @IsOptional()
    enable?: boolean;
}

/**
 * 更新密码参数流通对象
 */
export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty({ message: '密码不能为空' })
    @Length(6, 20, { message: '密码长度为6-20个字符之间' })
    password: string;
}


export class UpdateProfileDto extends ProfileDto { }