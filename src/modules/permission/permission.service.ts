import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permissionRep: Repository<Permission>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRep.create(createPermissionDto);
    return this.permissionRep.save(permission);
  }

  /**
   * 批量插入
   */
  batchCreate(permissionDtos: CreatePermissionDto[]) {
    const permissions = this.permissionRep.create(permissionDtos);
    return this.permissionRep.save(permissions);
  }

  findAll() {
    return this.permissionRep.find();
  }

  // async findMenu() {
  //   return await this.permissionRep.find({
  //     where: {
  //       type: 'MENU',
  //       order: {
  //         order: 'ASC'
  //       }
  //     }
  //   })
  // }

  findButtonByParentId(parentId: string) {
    return this.permissionRep.find({
      where: { parentId, type: In(['BUTTON']) },
    });
  }

  findOne(id: string) {
    return this.permissionRep.findOne({ where: { id } });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    if (!permission) throw new BadRequestException('权限不存或者已删除');
    const newPermission = this.permissionRep.merge(
      permission,
      updatePermissionDto,
    );
    await this.permissionRep.save(newPermission);
    return true;
  }

  // TODO 递归删除所有子孙权限
  async remove(id: string) {
    const permission = await this.permissionRep.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!permission) throw new BadRequestException('权限不存在或者已删除');
    if (permission.roles?.length)
      throw new BadRequestException('当前权限存在已授权的角色，不允许删除！');
    await this.permissionRep.remove(permission);
    return true;
  }
}
