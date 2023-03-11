import { Test, TestingModule } from '@nestjs/testing';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';

import { Readable } from 'stream';
import { StreamableFile } from '@nestjs/common';

describe('CreationController', () => {
  let controller: CreationController;
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
      controllers: [CreationController],
      providers: [CreationService],
    }).compile();

    controller = module.get<CreationController>(CreationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('test stub', () => {
      expect(() => {
        controller.uploadFile(toFile('{"a": "hello"}')).then((value) => {
          expect(value).toStrictEqual({ timeEstimate: 1, token: 'abc' });
        });
      }).not.toThrowError();
    });
  });

  describe('download', () => {
    it('test stub', () => {
      expect(() => {
        controller.uploadFile(toFile('{"a": "hello"}')).then((value) => {
          expect(value).toStrictEqual({ timeEstimate: 1, token: 'abc' });
        });
      }).not.toThrowError();

      expect(() => {
        controller.downloadFile('abc').then((value) => {
          const expectedOutput = new StreamableFile(
            Buffer.from('sample output'),
          );
          expect(value.getStream()).toStrictEqual(expectedOutput.getStream());
        });
      }).not.toThrowError();
    });
  });
});
