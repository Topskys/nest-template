import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto, DropRecordDto, PageRecordDto } from './record.dto';
import { Result } from '@/utils/Result';
import { DELETE_SUCCESS } from '@/constants';
import { PageVo } from '@/vo/page.vo';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  async create(@Req() req: any, @Body() createRecordDto: CreateRecordDto) {
    return await this.recordService.create(req, createRecordDto);
  }

  @Get()
  async findAll(@Query() query: PageRecordDto) {
    const { page, pageSize } = query;
    const [rows, total] = await this.recordService.findAll(query);
    return Result.ok(new PageVo(rows, total, page, pageSize));
  }

  @Delete()
  async remove(@Body() dropRecordDto: DropRecordDto) {
    const { ids } = dropRecordDto;
    await this.recordService.batchRemove(ids);
    return Result.ok(undefined, DELETE_SUCCESS);
  }
}
