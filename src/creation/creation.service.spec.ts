import { Test, TestingModule } from '@nestjs/testing';
import { CreationService } from './creation.service';

describe('CreationService', () => {
  let service: CreationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreationService],
    }).compile();

    service = module.get<CreationService>(CreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
