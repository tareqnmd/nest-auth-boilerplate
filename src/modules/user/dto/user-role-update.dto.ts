import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserField } from '../../../common/enum';
import { UserRoleEnum } from '../enum';

export class UserRoleUpdateDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRoleEnum,
    example: UserRoleEnum.USER,
  })
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  [UserField.ROLE]: UserRoleEnum;
}
