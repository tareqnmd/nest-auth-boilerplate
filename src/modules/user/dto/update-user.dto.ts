import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATION_CONSTANTS } from '../../../common/constants';
import { UserField } from '../../../common/enum';
import validationMessage from '../../../common/messages/validation.message';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    minLength: VALIDATION_CONSTANTS.NAME_MIN_LENGTH,
    maxLength: VALIDATION_CONSTANTS.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MinLength(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, {
    message: validationMessage.user.firstNameMin,
  })
  @MaxLength(VALIDATION_CONSTANTS.NAME_MAX_LENGTH, {
    message: validationMessage.user.firstNameMax,
  })
  [UserField.FIRST_NAME]?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    minLength: VALIDATION_CONSTANTS.NAME_MIN_LENGTH,
    maxLength: VALIDATION_CONSTANTS.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsOptional()
  @MinLength(VALIDATION_CONSTANTS.NAME_MIN_LENGTH, {
    message: validationMessage.user.lastNameMin,
  })
  @MaxLength(VALIDATION_CONSTANTS.NAME_MAX_LENGTH, {
    message: validationMessage.user.lastNameMax,
  })
  [UserField.LAST_NAME]?: string;

  @ApiPropertyOptional({
    description: 'User profile image URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: validationMessage.user.imageUrl })
  @MinLength(VALIDATION_CONSTANTS.URL_MIN_LENGTH)
  [UserField.IMAGE]?: string;

  @ApiPropertyOptional({
    description: 'User account status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  [UserField.IS_ACTIVE]?: boolean;
}
