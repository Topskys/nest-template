import { Base } from "@/modules/base.entity";
import { Permission } from "@/modules/permission/entities/permission.entity";
import { User } from "@/modules/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity({ comment: '角色表' })
export class Role extends Base {

    @Column({ unique: true, length: 50, comment: '编码' })
    code: string;

    @Column({ unique: true, length: 50, comment: '名称' })
    name: string;

    @Column({ default: true, comment: '是否启用' })
    enable: boolean;

    @ManyToMany(() => User, (user) => user.roles, {
        createForeignKeyConstraints: false,
    })
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles, {
        createForeignKeyConstraints: false
    })
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Permission[];
}