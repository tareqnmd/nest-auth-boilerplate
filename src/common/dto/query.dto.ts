import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedSortDto } from './sort.dto';

export class QueryDto extends PaginatedSortDto {
  @ApiPropertyOptional({
    description: 'Search term to filter results',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
