import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { createRoleDto } from './role.dto';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role) private roleRep: Repository<Role>,
        @InjectRepository(Permission) private permissionRep: Repository<Permission>
    ) { }

    async create(createRoleDto: createRoleDto) {
        // 检查是否重复
        const existRole = await this.roleRep.findOne({
            where: [{ name: createRoleDto.name, code: createRoleDto.code }]
        })
        if (existRole) throw new BadRequestException('角色已存在（角色名和角色编码不能重复）');
        // 插入角色
        const newRole = this.roleRep.create(createRoleDto);
        // 插入权限
        if (createRoleDto.permissionIds) {
            newRole.permissions = await this.permissionRep.find({
                where: { id: In(createRoleDto.permissionIds) }
            })
        }
        return await this.roleRep.save(newRole);
    }
}
