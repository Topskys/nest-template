import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageUserDto } from './dto/user.dto';
import { PageVo } from '@/vo/page.vo';
import { Result } from '@/utils/Result';
import { ADD_SUCCESS, QUERY_SUCCESS } from '@/constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * 添加用户
   * @param createUserDto 
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    delete user.password;
    return Result.ok(user, ADD_SUCCESS);
  }

  /**
   * 分页查询
   * @param query 分页参数
   * @returns PageVo<User>
   */
  @Get()
  async findAll(@Query() query: PageUserDto) {
    const { page, pageSize } = query;
    const [users, total] = await this.userService.findByPage(query)
    return Result.ok(new PageVo(users, total, page, pageSize), QUERY_SUCCESS);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
