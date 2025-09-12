import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByEmailProvider } from './get-user-by-email.provider';

describe('GetUserByEmailProvider', () => {
  let provider: GetUserByEmailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetUserByEmailProvider],
    }).compile();

    provider = module.get<GetUserByEmailProvider>(GetUserByEmailProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
