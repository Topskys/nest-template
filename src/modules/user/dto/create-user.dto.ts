import {
  Allow,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ProfileDto {
  @Allow()
  nickname: string;

  @Allow()
  gender: number;

  @Allow()
  avatar: string;

  @Allow()
  address: string;

  @Allow()
  phone: string;

  @Allow()
  email: string;

  /**
   * 初始化个人信息
   * @param profile 个人信息对象
   */
  constructor(profile: ProfileDto) {
    this.address = profile?.address;
    this.avatar = profile?.avatar;
    this.email = profile?.email;
    this.gender = profile?.gender;
    this.nickname = profile?.nickname;
    this.phone = profile?.phone;
  }
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(2, 10, { message: '用户名长度在2-10之间' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度在6-20之间' })
  password: string;

  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @IsOptional()
  profile?: ProfileDto;

  @IsOptional()
  @IsArray()
  roleIds?: string[];
}
