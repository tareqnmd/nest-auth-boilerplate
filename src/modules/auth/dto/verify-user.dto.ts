import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthField, CommonField } from '../../../common/enum';

export class VerifyUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  [CommonField.USER_ID]: string;

  @ApiProperty({
    description: 'Token',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  [AuthField.TOKEN]: string;
}
