import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ comment: '操作日志表' }) // ip 城市 名称 路径 方法 参数 耗时 时间
export class Record {
  @PrimaryGeneratedColumn({ comment: '编号' })
  id: number;

  @Column({
    name: 'operator_id',
    comment: '操作人ID',
    nullable: true,
  })
  operatorId: string;

  @Column({
    name: 'operator_name',
    type: 'varchar',
    comment: '操作人账号',
    nullable: true,
  })
  operatorName: string;

  @Column({
    type: 'varchar',
    length: 256,
    comment: '记录动作',
    nullable: true,
  })
  action: string;

  @Column({
    comment: 'IP',
  })
  ip: string;

  @Column({
    nullable: true,
    comment: 'ip解析的位置',
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 256,
    comment: '记录模块',
    nullable: true,
  })
  module: string;

  @Column({ type: 'varchar', length: 256, comment: '信息', nullable: true })
  message: string;

  @Column({ type: 'text', comment: '详情', nullable: true, })
  detail: string;

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
    comment: '创建时间',
    nullable: true,
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
    comment: '更新时间',
    nullable: true,
  })
  updateTime: Date;
}
