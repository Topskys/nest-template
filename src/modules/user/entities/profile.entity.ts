import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Base } from '@/modules/base.entity';

@Entity({ name: 'profile', comment: '用户个人信息表' })
export class Profile extends Base {
  @Column({ nullable: true, comment: '手机号' })
  phone: string;

  @Column({ nullable: true, comment: '邮箱' })
  email: string;

  @Column({ nullable: true, length: 10, comment: '昵称' })
  nickname: string;

  @Column({ nullable: true, comment: '性别' })
  gender: number;

  @Column({ default: 'http', comment: '头像' })
  avatar: string;

  @Column({ nullable: true, comment: '地址' })
  address: string;

  @OneToOne(() => User, (user) => user.profile, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    // referencedColumnName: 'id',
    // foreignKeyConstraintName: 'user_id',
  }) // 关联列
  user: User;

  /**
   * 用于取代关联列插入与查询输出
   */
  @Column({ name: 'user_id', unique: true, comment: '用户编号' })
  userId: string;
}
