import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../../common/constants';
import { UserRoleEnum } from '../../user/enum';

export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
