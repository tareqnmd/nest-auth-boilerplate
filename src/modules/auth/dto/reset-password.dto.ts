import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthField, CommonField, UserField } from '../../../common/enum';

export class ResetPasswordDto {
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

  @IsString()
  @IsNotEmpty()
  [UserField.NEW_PASSWORD]: string;
}
