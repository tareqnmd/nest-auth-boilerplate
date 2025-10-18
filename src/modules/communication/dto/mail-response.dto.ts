import { ApiProperty } from '@nestjs/swagger';
import { MailResponseField } from '../../../common/enum';

export class MailResponseDto {
  @ApiProperty({
    description: 'Whether the email was sent successfully',
    example: true,
  })
  [MailResponseField.SUCCESS]: boolean;

  @ApiProperty({
    description: 'Message ID from the email server',
    example: '<abc123@gmail.com>',
  })
  [MailResponseField.MESSAGE_ID]: string;

  @ApiProperty({
    description: 'Response message',
    example: 'Email sent successfully',
  })
  [MailResponseField.MESSAGE]: string;
}
