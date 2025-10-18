import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserField } from '../../../common/enum';

export class UpdateUserSocialIdDto {
  @ApiProperty({
    description: 'Google ID',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  [UserField.GOOGLE_ID]?: string;

  @ApiProperty({
    description: 'Facebook ID',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  [UserField.GITHUB_ID]?: string;

  @ApiProperty({
    description: 'User is user verified',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  [UserField.IS_USER_VERIFIED]: boolean;
}
