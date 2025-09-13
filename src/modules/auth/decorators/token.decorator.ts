import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/common/constants';
import {
  ITokenUser,
  RequestWithUser,
} from 'src/common/interfaces/user.interface';

export const Token = createParamDecorator(
  (field: keyof ITokenUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request[REQUEST_USER_KEY];
    return field ? user[field] : user;
  },
);
