import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { CreateRecordDto, PageRecordDto } from './record.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record) private recordRep: Repository<Record>,
  ) {}

  /**
   * 插入记录
   */
  async create(req: any, createRecordDto: CreateRecordDto) {
    const record = this.recordRep.create(createRecordDto);
    await this.recordRep.save(record);
    return true;
  }

  /**
   * 分页查询
   */
  findAll(query: PageRecordDto) {
    const { page, pageSize, startTime, endTime } = query;
    const options: FindManyOptions<Record> = {
      order: {
        createTime: 'DESC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    };
    options.where['createTime'] = Between(startTime, endTime);
    return this.recordRep.findAndCount(options);
  }

  /**
   * 批量删除记录
   * @param ids 编号数组
   */
  async batchRemove(ids: string[]) {
    const result = await this.recordRep.delete(ids);
    return result.affected > 0;
  }

  /**
   * 定时任务
   * 重置数据库记录表（注意：将会清空所有数据）
   */
  // @Cron("")
  async resetRecord() {
    await this.recordRep.clear();
    Logger.log('重置数据库记录表', 'RecordService');
    return true;
  }
}
