import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenNPayload } from 'src/common/interfaces/token-user.interface';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class AuthTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async generateToken<T>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      },
      {
        expiresIn: expiresIn,
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  public async generateTokens(user: ITokenNPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(user.id, this.jwtConfiguration.accessTokenTTL, {
        email: user.email,
      }),
      this.generateToken(user.id, this.jwtConfiguration.refreshTokenTTL),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
