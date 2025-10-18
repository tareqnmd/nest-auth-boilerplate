import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../../../common/constants';
import { AuthTypeEnum } from '../auth.enum';

export const Auth = (...authTypeEnum: AuthTypeEnum[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypeEnum);
