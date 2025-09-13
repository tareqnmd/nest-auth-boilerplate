import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_USER_KEY } from 'src/common/constants';
import {
  ITokenUser,
  RequestWithUser,
} from 'src/common/interfaces/user.interface';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<ITokenUser>(
        token,
        this.jwtConfiguration,
      );
      const isExpired = Date.now() >= payload?.exp * 1000;
      if (isExpired) {
        throw new UnauthorizedException();
      }
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
