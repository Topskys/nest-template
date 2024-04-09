import { PartialType } from '@nestjs/mapped-types';
import { Record } from './record.entity';
import { PageDto } from '../page.dto';
import { ArrayMinSize, IsISO8601, IsOptional } from 'class-validator';

export class CreateRecordDto extends PartialType(Record) {}

export class PageRecordDto extends PageDto {
  @IsOptional()
  @IsISO8601()
  startTime?: Date;

  @IsOptional()
  @IsISO8601()
  endTime?: Date;

  constructor() {
    super();
    // 格式化时间参数
    this.startTime = this.startTime ? new Date(this.startTime) : new Date(0);
    this.endTime = this.endTime ? new Date(this.endTime) : new Date();
  }
}

export class DropRecordDto {
  @ArrayMinSize(1, { message: '请选择要删除的记录' })
  ids: string[];
}
