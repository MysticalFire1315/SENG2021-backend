import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';

describe('DocsController', () => {
  let controller: DocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocsController],
      providers: [DocsService],
    }).compile();

    controller = module.get<DocsController>(DocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Test changelog', async () => {
    const expected = readFileSync(
      join(process.cwd(), 'changelog.txt'),
    ).toString();
    const actual = (await controller.getLogs()).getStream().read().toString;

    expect(actual).toStrictEqual(expected);
  });
});
