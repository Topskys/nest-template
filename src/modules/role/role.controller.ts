import { Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Result } from '@/utils/Result';
import { ADD_SUCCESS } from '@/constants';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post('create')
  async create() {
    const role = await this.roleService.create();
    return Result.ok(role,ADD_SUCCESS);
  }

  
}
