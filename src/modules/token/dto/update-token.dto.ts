import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { TokenField } from '../../../common/enum';

export class UpdateTokenDto {
  @ApiProperty({
    description: 'Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  [TokenField.TOKEN]: string;

  @ApiProperty({
    description: 'Token expires at',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  [TokenField.EXPIRES_AT]: Date;
}
