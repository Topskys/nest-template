import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ comment: '操作日志表' })
export class Record {

    @PrimaryGeneratedColumn({ comment: '编号' })
    id: number;

    @Column({
        name: 'operator_id',
        comment: "操作人ID",
    })
    operatorId: string;

    @Column({
        name: 'operator_name',
        type: "varchar",
        comment: "操作人账号",
    })
    operatorName: string;

    @Column({
        type: "varchar",
        length: 256,
        comment: "记录动作",
    })
    action: string;

    @Column({
        comment: "IP",
    })
    ip: string;

    @Column({
        comment: "ip解析的位置",
    })
    location: string;

    @Column({
        type: "varchar",
        length: 256,
        comment: "记录模块",
    })
    module: string;

    @Column({ type: "varchar", length: 256, comment: "信息", nullable: false })
    message: string;

    @Column({ type: "text", comment: "详情", nullable: false })
    detail: string;

    @CreateDateColumn({
        name: "create_time",
        type: "timestamp",
        comment: "创建时间",
    })
    createTime: Date;

    @UpdateDateColumn({
        name: "update_time",
        type: "timestamp",
        comment: "更新时间",
    })
    updateTime: Date;

}
