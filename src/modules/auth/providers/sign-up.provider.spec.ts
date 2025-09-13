import { Test, TestingModule } from '@nestjs/testing';
import { SignUpProvider } from './sign-up.provider';

describe('SignUpProvider', () => {
  let provider: SignUpProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignUpProvider],
    }).compile();

    provider = module.get<SignUpProvider>(SignUpProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
