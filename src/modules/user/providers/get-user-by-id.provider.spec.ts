import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdProvider } from './get-user-by-id.provider';

describe('GetUserByIdProvider', () => {
  let provider: GetUserByIdProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetUserByIdProvider],
    }).compile();

    provider = module.get<GetUserByIdProvider>(GetUserByIdProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
