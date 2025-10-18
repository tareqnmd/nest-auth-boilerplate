import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommonField } from '../../../common/enum';

export class UnlockAccountDto {
  @ApiProperty({
    description: 'User ID to unlock',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  [CommonField.USER_ID]: string;
}
