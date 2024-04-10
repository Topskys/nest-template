import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ comment: '操作日志表' }) //（ip 城市 路由 路由方法 模块 方法 参数 描述 操作人 操作人姓名）
export class Record {
  @PrimaryGeneratedColumn({ comment: '编号' })
  id: number;

  @Column({
    comment: 'IP',
    nullable: true,
  })
  ip: string;

  @Column({
    nullable: true,
    comment: 'ip解析的位置（城市）',
  })
  location: string;

  @Column({ comment: '请求方法', nullable: true })
  method: string;

  @Column({ comment: '路径', nullable: true })
  path: string;

  @Column({
    comment: '模块名',
    nullable: true,
  })
  module: string;

  @Column({
    comment: '方法名',
    nullable: true,
  })
  action: string;

  @Column({ type: 'text', comment: '参数', nullable: true })
  params: string;

  @Column({ name: 'cost_time', comment: '耗时（ms）', nullable: true })
  costTime: number;

  @Column({
    comment: '描述',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'operator_id',
    comment: '操作人ID',
    nullable: true,
  })
  operatorId: string;

  @Column({
    name: 'operator_name',
    type: 'varchar',
    comment: '操作人姓名',
    nullable: true,
  })
  operatorName: string;

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
    comment: '创建时间',
    nullable: true,
  })
  createTime: Date;
}
