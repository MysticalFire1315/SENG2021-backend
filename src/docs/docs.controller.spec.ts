import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';

describe('DocsController', () => {
  let controller: DocsController;

  const docsPath = join(process.cwd(), 'src/docs/static/');

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

  it('Test retrieving changelog', async () => {
    const expected = readFileSync(docsPath + 'changelog.txt').toString();
    const actual = (await controller.getLogs()).getStream().read().toString();

    expect(actual).toStrictEqual(expected);
  });

  it('Test retrieving schema', async () => {
    const expected = readFileSync(docsPath + 'input.schema.json').toString();
    const actual = (await controller.getSchemaCreationUpload())
      .getStream()
      .read()
      .toString();

    expect(actual).toStrictEqual(expected);
  });

  it('Test retrieving guide', async () => {
    const expected = readFileSync(docsPath + 'guide.md').toString();
    const actual = (await controller.getUserGuide())
      .getStream()
      .read()
      .toString();

    expect(actual).toStrictEqual(expected);
  });
});
