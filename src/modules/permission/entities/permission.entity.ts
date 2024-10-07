import { Role } from '@/modules/role/entities/role.entity';
import { Base } from '@/modules/base.entity';
import { PermissionType } from '@/types';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity({ comment: '权限菜单表' })
export class Permission extends Base {
  @Column({ comment: '菜单名称' })
  title: string;

  @Column({ unique: true, comment: '路由名称' })
  name?: string;

  @Column({ unique: true, length: 50, comment: '编码' })
  code: string;

  @Column({ comment: '类型' })
  type: 'MENU' | 'BUTTON' | 'API';

  @Column({ nullable: true, comment: '路径' })
  path?: string;

  @Column({ nullable: true, comment: '重定向' })
  redirect?: string;

  @Column({ nullable: true, comment: '图标' })
  icon?: string;

  @Column({ nullable: true, comment: '组件' })
  component?: string;

  @Column({ name: 'no_cache', nullable: true, comment: '不缓存' })
  noCache?: boolean;

  @Column({ nullable: true, comment: '描述或备注' })
  description?: string;

  @Column({ default: false, comment: '是否隐藏' })
  hidden?: boolean;

  @Column({ default: false, comment: '是否固定在面包屑下边的导航栏' })
  affix?: boolean;

  @Column({ name: 'is_frame', default: false, comment: 'frame' })
  isFrame?: boolean;

  @Column({ name: 'is_link', nullable: true, comment: '外链' })
  isLink?: boolean;

  @Column({ name: 'link_url', nullable: true, comment: '外链的链接' })
  link_url?: string;

  @Column({ name: 'always_show', default: false, comment: '总是显示' })
  alwaysShow?: boolean;

  @Column({ name: 'active_menu', nullable: true, comment: '高亮菜单' })
  activeMenu?: string;

  @Column({ default: true, comment: '是否启用' })
  enable?: boolean;

  @Column({ unique: true, nullable: true, comment: '排序' })
  order?: number;

  @Column({ name: 'parent_id', nullable: true, comment: '父级编号' })
  parentId?: string;

  @ManyToOne(() => Permission, (permission) => permission.children, {
    createForeignKeyConstraints: false,
  })
  parent: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent, {
    createForeignKeyConstraints: false,
  })
  children: Permission[];

  @ManyToMany(() => Role, (role) => role.permissions, {
    createForeignKeyConstraints: false,
  })
  roles: Role[];
}
