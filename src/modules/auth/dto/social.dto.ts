import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthField } from '../../../common/enum';
import { SocialProviderEnum } from '../enum';

export class SocialDto {
  @ApiProperty({
    description: 'Social authentication token from provider',
    example: 'ya29.a0AfH6SMBx...',
  })
  @IsString()
  @IsNotEmpty()
  [AuthField.TOKEN]: string;

  @ApiProperty({
    description: 'Social authentication provider type',
    enum: SocialProviderEnum,
    example: SocialProviderEnum.GOOGLE,
  })
  @IsNotEmpty()
  @IsEnum(SocialProviderEnum)
  [AuthField.SOCIAL_PROVIDER]: SocialProviderEnum;
}
