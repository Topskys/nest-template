import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import {
  CustomException,
  ErrorCode,
} from '@/common/exceptions/custom.exception';
import { Role } from '../role/entities/role.entity';
import { hashSync } from 'bcryptjs';
import { PageUserDto, UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Profile) private profileRep: Repository<Profile>,
    @InjectRepository(Role) private roleRep: Repository<Role>,
  ) {}

  /**
   * 添加用户
   * @param createUserDto
   * @returns user
   */
  async create(createUserDto: CreateUserDto) {
    const { username, roleIds = [] } = createUserDto;
    // 根据用户名检查用户是否已存在
    if (await this.findByUsername(username)) {
      throw new CustomException(ErrorCode.ERR_10001);
    }
    // 插入用户信息
    const newUser = this.userRep.create(createUserDto); // 等同于new User()后执行@BeforeInsert标记的方法
    // 更新用户角色
    if (roleIds?.length > 0) {
      newUser.roles = await this.roleRep.find({
        where: { id: In(roleIds) },
      });
    }
    // 判断是否插入默认用户个人信息
    if (!createUserDto?.profile) {
      newUser.profile = this.profileRep.create();
    }
    // 密码加密（已被实体的@BeforeInsert标记的hashPassword方法代替）
    // newUser.password = hashSync(newUser.password);
    // 更新保存用户信息
    return await this.userRep.save(newUser);
  }

  /**
   * 分页查询
   * @param pageUserDto 分页参数
   * @returns [T[],total]
   */
  async findByPage(pageUserDto: PageUserDto) {
    const { page, pageSize, ...other } = pageUserDto;
    const options: FindManyOptions<User> = {
      select: {
        profile: {
          gender: true,
          avatar: true,
          email: true,
          address: true,
        },
        roles: true,
      },
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        username: Like(`%${other.username}%`),
        enable: other.enable || undefined,
        profile: {
          gender: other.gender || undefined,
        },
      },
      order: {
        createTime: 'ASC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    };
    return await this.userRep.findAndCount(options);
  }

  /**
   * 获取用户详细信息
   * @param id 编号
   * @returns user
   */
  findOne(id: string) {
    return this.userRep.findOne({
      where: { id },
      relations: {
        roles: true,
        profile: true,
      },
    });
  }

  /**
   * 修改用户（暂未使用）
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const findUser = await this.findUserProfile(id);
    if (updateUserDto.roleIds !== undefined) {
      findUser.roles = await this.roleRep.find({
        where: { id: In(updateUserDto.roleIds) },
      });
    }
    const newUser = this.userRep.merge(findUser, updateUserDto);
    await this.userRep.save(newUser);
    return true;
  }

  /**
   * 根据用户编号逻辑删除用户信息（账户信息、个人信息、角色权限）
   * @param id 编号
   * @returns boolean
   */
  async remove(id: string) {
    // 固有用户不能删除
    // if(id=='1') throw new CustomException(ErrorCode.ERR_11006,"不能删除根用户");
    await this.userRep.delete(id);
    await this.profileRep
      .createQueryBuilder('profile')
      .delete()
      .where('profile.userId=:id', { id })
      .execute();
    // await this.roleRep.delete({ userId: id });
    return true;
  }

  /**
   * 修改个人信息
   * @param id 编号
   * @param profile 个人信息对象
   * @returns boolean
   */
  async updateProfile(id: string, profile: UpdateProfileDto) {
    const user = await this.findUserProfile(id);
    user.profile = this.profileRep.merge(user.profile, profile);
    return await this.userRep.save(user);
  }

  /**
   * 修改账户密码
   * @param id 编号
   * @param password 新密码
   * @returns boolean
   */
  async resetPassword(id: string, password: string) {
    const user = await this.userRep.findOne({ where: { id } });
    user.password = hashSync(password);
    await this.userRep.save(user);
    return true;
  }

  /**
   * 根据用户查询用户信息
   * @param username 用户名
   * @returns {"id", "username", "password", "enable"}
   */
  findByUsername(username: string) {
    return this.userRep.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'enable'],
      relations: {
        profile: true,
        roles: true,
      },
    });
  }

  /**
   * 根据用户id查询用户个人信息
   * @param userId 用户id
   * @returns user
   */
  findUserProfile(userId: string) {
    return this.userRep.findOne({
      where: { id: userId },
      relations: {
        profile: true,
        roles: true,
      },
    });
  }
}
