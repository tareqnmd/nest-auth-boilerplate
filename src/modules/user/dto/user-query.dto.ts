import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { UserField } from '../../../common/enum';
import { UserRoleEnum } from '../enum';

const stringToBoolean = ({
  value,
}: {
  value: string | boolean;
}): boolean | undefined => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
};

export class UserQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user role',
    enum: UserRoleEnum,
    example: UserRoleEnum.USER,
  })
  @IsOptional()
  @IsEnum(UserRoleEnum)
  [UserField.ROLE]?: UserRoleEnum;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    type: Boolean,
    example: true,
  })
  @Transform(stringToBoolean)
  @IsOptional()
  @IsBoolean()
  [UserField.IS_ACTIVE]?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by verified status',
    type: Boolean,
    example: true,
  })
  @Transform(stringToBoolean)
  @IsOptional()
  @IsBoolean()
  [UserField.IS_USER_VERIFIED]?: boolean;
}
