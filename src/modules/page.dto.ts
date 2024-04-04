import { Allow } from 'class-validator';

/**
 * 分页参数流通对象
 */
export class PageDto {
  @Allow()
  page?: number = 1;

  @Allow()
  pageSize?: number = 10;
}
