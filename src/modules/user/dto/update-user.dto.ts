import { IsOptional, IsString } from 'class-validator';

export class UpdateUserSocialDto {
  @IsString()
  @IsOptional()
  googleId?: string;

  @IsString()
  @IsOptional()
  githubId?: string;
}
