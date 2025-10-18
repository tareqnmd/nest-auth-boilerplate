import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserField } from '../../../common/enum';
import validationMessage from '../../../common/messages/validation.message';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  [UserField.OLD_PASSWORD]: string;

  @ApiProperty({
    description:
      'New password (must contain uppercase, lowercase, and number/special character)',
    example: 'NewPassword123!',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: validationMessage.user.passwordComplexity,
  })
  [UserField.NEW_PASSWORD]: string;
}
