import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Filter by exact match on a field',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiPropertyOptional({
    description: 'Filter value',
    example: 'true',
  })
  @IsOptional()
  @IsString()
  filterValue?: string;
}
