import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 公共实体父类
 */
export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_deleted', default: false, comment: '是否删除' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @Column({ name: 'create_user_id', nullable: true, comment: '创建人编号' })
  createUserId?: string;

  @Column({ name: 'update_user_id', nullable: true, comment: '更新人编号' })
  updateUserId?: string;

  @Column({ name: 'create_user_name', nullable: true, comment: '创建人名称' })
  createUserName?: string;

  @Column({ name: 'update_user_name', nullable: true, comment: '更新人名称' })
  updateUserName?: string;
}
