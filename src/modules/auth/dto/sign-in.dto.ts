import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { VALIDATION_CONSTANTS } from '../../../common/constants';
import { UserField } from '../../../common/enum';

export class SignInDto {
  @ApiPropertyOptional({
    description: 'User email address (required if phone not provided)',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  [UserField.EMAIL]: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    minLength: VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH)
  [UserField.PASSWORD]: string;
}
