import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATION_CONSTANTS } from '../../../common/constants';
import { UserField } from '../../../common/enum';
import validationMessage from '../../../common/messages/validation.message';

export class SignUpDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: VALIDATION_CONSTANTS.NAME_MIN_LENGTH,
    maxLength: VALIDATION_CONSTANTS.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(VALIDATION_CONSTANTS.NAME_MIN_LENGTH)
  @MaxLength(VALIDATION_CONSTANTS.NAME_MAX_LENGTH)
  [UserField.FIRST_NAME]: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: VALIDATION_CONSTANTS.NAME_MIN_LENGTH,
    maxLength: VALIDATION_CONSTANTS.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(VALIDATION_CONSTANTS.NAME_MIN_LENGTH)
  @MaxLength(VALIDATION_CONSTANTS.NAME_MAX_LENGTH)
  [UserField.LAST_NAME]: string;

  @ApiPropertyOptional({
    description: 'User email address (required if phone not provided)',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  [UserField.EMAIL]?: string;

  @ApiProperty({
    description:
      'User password (must contain uppercase, lowercase, and number/special character)',
    example: 'Password123!',
    minLength: VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH,
    maxLength: VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH)
  @MaxLength(VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: validationMessage.auth.passwordComplexity,
  })
  [UserField.PASSWORD]: string;
}
