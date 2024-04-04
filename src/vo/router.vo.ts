import { Permission } from '@/modules/permission/entities/permission.entity';

/**
 * 路由meta信息
 */
export class Meta {
  /**
   * 图标
   */
  icon: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 权限角色（可访问的角色数组）
   */
  roles?: any[] = [];
  /**
   * 连接
   */
  isLink: boolean;
  /**
   * 是否隐藏
   */
  hidden: boolean;
  /**
   * 是否缓存页面
   */
  onCache: boolean;
  /**
   * 是否是内链
   */
  isFrame: boolean;

  /**
   * 是否固定
   */
  affix: boolean;

  constructor(payload: Permission) {
    this.title = payload.title;
    this.icon = payload?.icon;
    this.roles = payload?.roles;
    this.hidden = payload?.hidden;
    this.onCache = payload?.noCache;
    this.isFrame = payload?.isFrame;
    this.affix = payload?.affix;
    this.isLink = payload?.isLink;
  }
}

export class RouterVo {
  /**
   * 菜单编号
   */
  id: string;
  /**
   * 路由名称
   */
  name?: string;
  /**
   * 路由地址
   */
  path: string;
  /**
   * 路由对应组件
   */
  component: string;
  /**
   * 是否显示
   */
  alwaysShow?: boolean;
  /**
   * 重定向
   */
  redirect: string;
  /**
   * 路由meta信息
   */
  meta: Meta;

  /**
   * 子路由数组
   */
  children?: RouterVo[] = [];

  constructor(payload: Permission) {
    this.id = payload.id;
    this.name = payload?.name;
    this.path = payload?.path;
    this.redirect = payload?.redirect;
    this.component = payload?.component;
  }
}
