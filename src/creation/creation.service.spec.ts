import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { convert } from 'xmlbuilder2';
import { CreationService } from './creation.service';
import { testAssetsPath } from './model/spec.config';

const path = join(process.cwd(), testAssetsPath);

describe('CreationService', () => {
  let service: CreationService;
  const readFile: (filePath: string) => string = (filePath) =>
    readFileSync(filePath).toString();

  const toFile: (contents: string) => Express.Multer.File = (contents) => {
    const bufferContents = Buffer.from(contents);
    const testFile: Express.Multer.File = {
      buffer: bufferContents,
      fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
      originalname: 'original-filename',
      encoding: 'utf8',
      mimetype: 'file-mimetyp',
      destination: 'destination-path',
      filename: 'file-name',
      path: 'file-path',
      size: 955578,
      stream: Readable.from(bufferContents),
    };

    return testFile;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreationService],
    }).compile();

    service = module.get<CreationService>(CreationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('Upload success', async () => {
      expect(() => {
        service
          .invoiceUpload(
            toFile(readFile(path + 'inputs/compulsory/InvoiceLine1M.json')),
          )
          .then((value) => {
            expect(value).toStrictEqual({ timeEstimate: 1, token: 'abc' });
          });
      }).not.toThrowError();
    });
  });

  describe('download', () => {
    it('Download success', () => {
      expect(() => {
        service
          .invoiceUpload(
            toFile(readFile(path + 'inputs/compulsory/InvoiceLine1M.json')),
          )
          .then((value) => {
            expect(value).toStrictEqual({ timeEstimate: 1, token: 'abc' });
          });
      }).not.toThrowError();

      expect(() => {
        service.invoiceDownload('abc').then((value) => {
          const expectedOutput = readFile(
            path + 'outputs/compulsory/InvoiceLine1M.xml',
          );
          const actualOutput = value.getStream().read().toString();

          const actualObj = convert(actualOutput, { format: 'object' });
          const expectedObj = convert(expectedOutput, { format: 'object' });
          expect(actualObj).toStrictEqual(expectedObj);
        });
      }).not.toThrowError();
    });
  });
});
