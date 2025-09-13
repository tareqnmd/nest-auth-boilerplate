import { IsNotEmpty, IsString } from 'class-validator';
import { SocialType } from '../enum/social-type.enum';

export class SocialDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  type: SocialType;
}
