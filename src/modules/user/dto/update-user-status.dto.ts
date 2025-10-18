import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserField } from '../../../common/enum';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'User status',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty()
  @IsOptional()
  [UserField.IS_ACTIVE]: boolean;
}
