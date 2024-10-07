import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from '@/modules/role/entities/role.entity';
import { Base } from '@/modules/base.entity';
import { hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user', comment: '用户表' })
export class User extends Base {
  @Column({ unique: true, length: 50, comment: '用户名' })
  username: string;

  @Exclude()
  @Column({ select: false, comment: '密码' })
  password: string;

  @Column({ default: true, comment: '是否启用' })
  enable: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  profile: Profile;

  @ManyToMany(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  /**
   * 插入之前执行密码加密
   */
  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password);
  }
}
