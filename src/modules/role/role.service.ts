import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { CreateRoleDto, PageRoleDto, UpdateRoleDto } from './role.dto';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRep: Repository<Role>,
    @InjectRepository(Permission) private permissionRep: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // 检查是否重复
    const existRole = await this.roleRep.findOne({
      where: [{ name: createRoleDto.name, code: createRoleDto.code }],
    });
    if (existRole)
      throw new BadRequestException('角色已存在（角色名和角色编码不能重复）');
    // 插入角色
    const newRole = this.roleRep.create(createRoleDto);
    // 插入权限
    if (createRoleDto.permissionIds) {
      newRole.permissions = await this.permissionRep.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
    }
    return await this.roleRep.save(newRole);
  }

  async findByPage(query: PageRoleDto) {
    const { pageSize, page, name, code, enable } = query;
    // 构建查询条件
    const [data, total] = await this.roleRep.findAndCount({
      where: {
        name: Like(`%${name || ''}%`),
        code: Like(`%${code || ''}%`),
        enable: enable || undefined,
      },
      relations: { permissions: true },
      order: {
        name: 'DESC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    // 格式化分页参数
    const pageData = data.map((v) => {
      const permissionIds = v.permissions.map((v) => v.id);
      delete v.permissions;
      return { ...v, permissionIds };
    });
    return { pageData, total };
  }

  findOptions() {
    return this.roleRep.find({
      where: { isDeleted: false },
      select: ['id', 'name', 'code', 'enable'],
    });
  }

  async remove(id: string) {
    const role = await this.roleRep.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    // 不允许删除超级管理员角色
    if (role.code?.toLocaleLowerCase() === 'super_admin') {
      throw new BadRequestException('不允许删除超级管理员角色！');
    }
    // 判断是否有角色关联用户
    if (role.users?.length) {
      throw new BadRequestException('当前角色存在已授的用户，不允许删除！');
    }
    // 更新角色状态
    role.isDeleted = true;
    await this.roleRep.save(role);
    return true;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findById(id);
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    // 不允许修改超级管理员角色
    if (updateRoleDto.code?.toLocaleLowerCase() === 'super_admin') {
      throw new BadRequestException('不允许修改超级管理员角色！');
    }
    // 验证角色编码是否重复
    const existRole = await this.roleRep.findOne({
      where: {
        code: updateRoleDto.code,
        name: updateRoleDto.name,
        id: Not(id),
      },
    });
    if (existRole) throw new BadRequestException('角色编码或名称存在重复！');
    // 更新角色信息
    const newRole = this.roleRep.merge(role, updateRoleDto);
    if (updateRoleDto.permissionIds?.length) {
      newRole.permissions = await this.permissionRep.find({
        where: { id: In(updateRoleDto.permissionIds) },
      });
    }
    await this.roleRep.save(newRole);
    return true;
  }

  findById(id: string) {
    return this.roleRep.findOne({ where: { id } });
  }

  /**
   *  查询按钮权限
   */
  async findButtonPermissionsByRoleIds(roleIds: string[]) {
    // 查询角色对应菜单
    const roles = await this.roleRep.find({
      select: {
        id: true,
        permissions: {
          id: true,
          code: true,
        },
      },
      where: { id: In(roleIds) },
      relations: ['permissions'],
    });
    // 映射出菜单编码（标识）
    const permissionCodes = roles
      .map((r) => r.permissions)
      .flat()
      .map((p) => p.code);
    return permissionCodes;
  }
}
