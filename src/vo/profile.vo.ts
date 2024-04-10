import { ProfileDto } from '@/modules/user/dto/create-user.dto';
import { User } from '@/modules/user/entities/user.entity';

/**
 * 登录后的个人信息视图对象
 */
export class ProfileVo extends ProfileDto {
  constructor(payload: Partial<User & { permissions: string[] }>) {
    super(payload.profile);
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        (this as any)[key] = payload[key];
      }
      // TODO：建议源头数据库查询处理Password
      if (['profile', 'password'].includes(key)) {
        delete this[key];
      }
    }
  }
}
