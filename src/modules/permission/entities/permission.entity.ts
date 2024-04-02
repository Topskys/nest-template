import { Role } from "@/modules/role/entities/role.entity";
import { Base } from "@/modules/base.entity";
import { MethodType, PermissionType } from "@/types";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity({ comment: "权限菜单表" })
export class Permission extends Base {

    @Column({ comment: "名称" })
    name: string;

    @Column({ unique: true, length: 50, comment: "编码" })
    code: string;

    @Column({ comment: "类型" })
    type: PermissionType;

    @ManyToOne(() => Permission, (permission) => permission.children, {
        createForeignKeyConstraints: false,
    })
    parent: Permission;

    @OneToMany(() => Permission, (permission) => permission.parent, {
        createForeignKeyConstraints: false,
    })
    children: Permission[];

    @Column({ nullable: true, comment: '父级编号' })
    parentId: string;

    @Column({ nullable: true, comment: '路径' })
    path: string;

    @Column({ nullable: true, comment: '重定向' })
    redirect: string;

    @Column({ nullable: true, comment: '图标' })
    icon: string;

    @Column({ nullable: true, comment: '组件' })
    component: string;

    @Column({ nullable: true })
    layout: string;

    @Column({ nullable: true, comment: '是否缓存' })
    keepAlive: boolean;

    @Column({ nullable: true, })
    method: MethodType;

    @Column({ nullable: true, comment: '描述或备注' })
    description: string;

    @Column({ default: true, comment: '是否展示在页面菜单' })
    show: boolean;

    @Column({ default: true, comment: '是否启用' })
    enable: boolean;

    @Column({ nullable: true, comment: '排序' })
    order: number;

    @ManyToMany(() => Role, (role) => role.permissions, {
        createForeignKeyConstraints: false,
    })
    roles: Role[];
}
