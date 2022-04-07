import { Test, TestingModule } from '@nestjs/testing';

import { CloudrunController } from './cloudrun.controller';
import { CloudrunService } from './cloudrun.service';

describe('CloudrunController', () => {
  let controller: CloudrunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudrunController],
      providers: [CloudrunService],
    }).compile();

    controller = module.get<CloudrunController>(CloudrunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
