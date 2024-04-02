import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { Profile } from "./profile.entity";
import { Role } from "@/modules/role/entities/role.entity";
import { Base } from "@/modules/base.entity";

@Entity({ comment: "用户表" })
export class User extends Base {

    @Column({ unique: true, length: 50, comment: '用户名' })
    username: string;

    @Column({ select: false, comment: '密码' })
    password: string;

    @Column({ default: true, comment: '是否启用' })
    enable: boolean;

    @OneToOne(() => Profile, profile => profile.user, {
        createForeignKeyConstraints: false,
        cascade: true
    })
    profile: Profile;

    @ManyToMany(() => Role, role => role.users, {
        createForeignKeyConstraints: false
    })
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        }
    })
    roles: Role[];
}
