import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DocsService } from './docs.service';

describe('DocsService', () => {
  let service: DocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocsService],
    }).compile();

    service = module.get<DocsService>(DocsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Test changelog', async () => {
    const expected = readFileSync(
      join(process.cwd(), '/src/docs/changelog.txt'),
    ).toString();
    const actual = (await service.getLogs()).getStream().read().toString();

    expect(actual).toStrictEqual(expected);
  });

  it('Test schema/creation/upload', async () => {
    const expected = readFileSync(
      join(process.cwd(), '/src/docs/input.schema.json'),
    ).toString();
    const actual = (await service.getSchemaCreationUpload())
      .getStream()
      .read()
      .toString();

    expect(actual).toStrictEqual(expected);
  });
});
