import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserField } from '../../../common/enum';
import { SignUpDto } from './sign-up.dto';

export class SignUpDtoWithSocial extends (SignUpDto as new () => Omit<
  SignUpDto,
  'password'
>) {
  @ApiProperty({
    description: 'User is user verified',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  [UserField.IS_USER_VERIFIED]?: boolean;

  @ApiProperty({
    description: 'User image',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  [UserField.IMAGE]?: string;
}
