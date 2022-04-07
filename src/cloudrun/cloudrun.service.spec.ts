import { Test, TestingModule } from '@nestjs/testing';

import { CloudrunService } from './cloudrun.service';

describe('CloudrunService', () => {
  let service: CloudrunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudrunService],
    }).compile();

    service = module.get<CloudrunService>(CloudrunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
