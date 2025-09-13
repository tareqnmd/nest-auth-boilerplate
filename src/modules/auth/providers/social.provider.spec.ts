import { Test, TestingModule } from '@nestjs/testing';
import { SocialProvider } from './social.provider';

describe('SocialProvider', () => {
  let provider: SocialProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialProvider],
    }).compile();

    provider = module.get<SocialProvider>(SocialProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
