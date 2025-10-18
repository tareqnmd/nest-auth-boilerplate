import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { APP_NAME } from '../../../common/constants';
import { SendMailDtoField } from '../../../common/enum';

export class SendMailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'recipient@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  [SendMailDtoField.TO]: string;

  @ApiProperty({
    description: 'Email subject',
    example: `Welcome to ${APP_NAME}`,
  })
  @IsString()
  @IsNotEmpty()
  [SendMailDtoField.SUBJECT]: string;

  @ApiProperty({
    description: 'Email body in plain text',
    example: `Thank you for joining ${APP_NAME}!`,
  })
  @IsString()
  @IsNotEmpty()
  [SendMailDtoField.TEXT]: string;

  @ApiPropertyOptional({
    description: 'Email body in HTML format (optional)',
    example: `<h1>Thank you for joining ${APP_NAME}!</h1>`,
  })
  @IsString()
  @IsOptional()
  [SendMailDtoField.HTML]?: string;
}
