import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TokenField } from '../../../common/enum';
import { TokenTypeEnum } from '../enum';

export class CreateTokenDto {
  @ApiProperty({
    description: 'Token type',
    example: TokenTypeEnum.REFRESH,
    enum: TokenTypeEnum,
  })
  @IsEnum(TokenTypeEnum)
  @IsNotEmpty()
  [TokenField.TYPE]: TokenTypeEnum;

  @ApiProperty({
    description: 'User ID',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  [TokenField.USER_ID]: string;

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
