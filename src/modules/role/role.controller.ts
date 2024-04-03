import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Result } from '@/utils/Result';
import { ADD_SUCCESS, EDIT_SUCCESS, QUERY_SUCCESS } from '@/constants';
import { CreateRoleDto, PageRoleDto } from './role.dto';
import { PageVo } from '@/vo/page.vo';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RoleGuard } from '@/common/guards/role.guard';

@Controller('role')
// @UseGuards(JwtGuard,RoleGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return Result.ok(role, ADD_SUCCESS);
  }

  @Get()
  async findAll(@Query() query: PageRoleDto) {
    const { page, pageSize } = query;
    const { total, pageData } = await this.roleService.findByPage(query);
    return Result.ok(new PageVo(pageData, total, page, pageSize), QUERY_SUCCESS);
  }

  @Get('options')
  async findOptions() {
    const res = await this.roleService.findOptions();
    return Result.ok(res, QUERY_SUCCESS);
  }

  @Patch(":id")
  async update(@Param('id') id: string, @Body() updateRoleDto: CreateRoleDto) {
    const isSeccuss = await this.roleService.update(id, updateRoleDto)
    if (isSeccuss) return Result.ok(undefined, EDIT_SUCCESS);
    return Result.error();
  }

  @Delete(":id")
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(id);
  }

}
