import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ConfigurationField } from '../../../common/enum';

export class UpdateConfigurationDto {
  @ApiPropertyOptional({
    description: 'Configuration value',
    example: 'Application name updated',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  [ConfigurationField.VALUE]: string;
}
