import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthProvider } from './google-auth.provider';

describe('GoogleAuthProvider', () => {
  let provider: GoogleAuthProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAuthProvider],
    }).compile();

    provider = module.get<GoogleAuthProvider>(GoogleAuthProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
