import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ConfigurationField } from '../../../common/enum';

export class CreateConfigurationDto {
  @ApiProperty({
    description: 'Configuration key',
    example: 'app_name',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  [ConfigurationField.KEY]: string;

  @ApiProperty({
    description: 'Configuration value',
    example: 'Application name',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  [ConfigurationField.VALUE]: string;
}
