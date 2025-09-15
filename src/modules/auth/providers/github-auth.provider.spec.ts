import { Test, TestingModule } from '@nestjs/testing';
import { GithubAuthProvider } from './github-auth.provider';

describe('GithubAuthProvider', () => {
  let provider: GithubAuthProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubAuthProvider],
    }).compile();

    provider = module.get<GithubAuthProvider>(GithubAuthProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
