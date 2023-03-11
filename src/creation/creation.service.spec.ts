import { StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import { CreationService } from './creation.service';

describe('CreationService', () => {
  let service: CreationService;
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
    it('test stub', () => {
      expect(() => {
        service.invoiceUpload(toFile('{"a": "hello"}')).then((value) => {
          expect(value).toStrictEqual({ timeEstimate: 1, token: 'abc' });
        });
      }).not.toThrowError();
    });
  });

  describe('download', () => {
    it('test stub', () => {
      expect(() => {
        service.invoiceUpload(toFile('{"a": "hello"}')).then((value) => {
          expect(value).toStrictEqual({ timeEstimate: 1, token: 'abc' });
        });
      }).not.toThrowError();

      expect(() => {
        service.invoiceDownload('abc').then((value) => {
          const expectedOutput = new StreamableFile(
            Buffer.from('sample output'),
          );
          expect(value.getStream()).toStrictEqual(expectedOutput.getStream());
        });
      }).not.toThrowError();
    });
  });
});
