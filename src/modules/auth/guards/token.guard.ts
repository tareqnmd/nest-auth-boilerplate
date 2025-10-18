import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_USER_KEY } from '../../../common/constants';
import { InvalidTokenException } from '../../../common/exceptions';
import {
  ITokenUser,
  RequestWithUser,
} from '../../../common/interfaces/user.interface';
import jwtConfig from '../../../config/jwt.config';

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
      throw new UnauthorizedException('Access token is required');
    }
    try {
      const payload = await this.jwtService.verifyAsync<ITokenUser>(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new InvalidTokenException();
    }
    return true;
  }
}
