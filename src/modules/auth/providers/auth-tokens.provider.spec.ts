import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokensProvider } from './auth-tokens.provider';

describe('AuthTokensProvider', () => {
  let provider: AuthTokensProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthTokensProvider],
    }).compile();

    provider = module.get<AuthTokensProvider>(AuthTokensProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
