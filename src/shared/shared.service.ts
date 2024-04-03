import { Permission } from "@/modules/permission/entities/permission.entity";
import { Meta, RouterVo } from "@/vo/router.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SharedService {

    /**
     * 生成菜单路由
     * @param menuList 菜单数组
     * @param pid 父级菜单id
     */
    public generateRouter(menuList: Permission[], pid: string | null = null) {
        const routerVoList = [];
        menuList.filter((m) => m && m.type == "MENU").forEach((item) => {
            if (item.parentId === pid || item.parentId=='') {
                const routerVo = new RouterVo(item);
                // 判断一级菜单路由
                if (item?.parentId === null || !item?.parentId) {
                    routerVo.component = 'Layout';
                }
                // 设置meta信息
                routerVo.meta = new Meta(item);
                console.log('-----9-0-0', routerVo)
                // 递归生成子路由
                const children = this.generateRouter(menuList, item.id);
                if (children?.length > 0) {
                    routerVo.children = children;
                }
                routerVoList.push(routerVo); // 修改这里，将路由项添加到 routerVoList 数组中
            }
        });
        return routerVoList;
    }

    /**
     * 生成菜单树
     * @param menuList 菜单数组
     * @param pid 父级菜单id
     */
    public static generateMenuTree(list: Permission[], pid: string | null = null) {
        const tree: Permission[] = [];
        for (const item of list) {
            if (item.parentId == pid || 0) {
                const children = this.generateMenuTree(list, item.id);
                if (children.length > 0) {
                    item.children = children;
                }
                tree.push(item);
            }
        }
        return tree;
    }

}