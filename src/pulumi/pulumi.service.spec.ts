import { Test, TestingModule } from '@nestjs/testing';

import { PulumiService } from './pulumi.service';

describe('PulumiService', () => {
  let service: PulumiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PulumiService],
    }).compile();

    service = module.get<PulumiService>(PulumiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
