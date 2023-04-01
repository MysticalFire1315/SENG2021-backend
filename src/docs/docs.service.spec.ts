import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DocsService } from './docs.service';

describe('DocsService', () => {
  let service: DocsService;
  const docsPath = join(process.cwd(), 'src/docs/static/');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocsService],
    }).compile();

    service = module.get<DocsService>(DocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Test retrieving changelog', async () => {
    const expected = readFileSync(docsPath + 'changelog.txt').toString();
    const actual = (await service.getLogs()).getStream().read().toString();

    expect(actual).toStrictEqual(expected);
  });

  it('Test retrieving schema', async () => {
    const expected = readFileSync(docsPath + 'input.schema.json').toString();
    const actual = (await service.getSchemaCreationUpload())
      .getStream()
      .read()
      .toString();

    expect(actual).toStrictEqual(expected);
  });

  it('Test retrieving guide', async () => {
    const expected = readFileSync(docsPath + 'guide.html').toString();
    const actual = await service.getUserGuide();

    expect(actual).toStrictEqual(expected);
  });
});
