import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { convert } from 'xmlbuilder2';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';
import { testAssetsPath } from './model/spec.config';

const path = join(process.cwd(), testAssetsPath);

describe('CreationController', () => {
  let controller: CreationController;
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
      controllers: [CreationController],
      providers: [CreationService],
    }).compile();

    controller = module.get<CreationController>(CreationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('Upload success', async () => {
      expect(() => {
        controller
          .uploadFile(
            toFile(readFile(path + 'inputs/compulsory/InvoiceLine1M.json')),
          )
          .then((value) => {
            expect(value).toStrictEqual({
              timeEstimate: expect.any(Number),
              token: 'abc',
            });
          });
      }).not.toThrowError();
    });
  });

  describe('download', () => {
    it('Download success', () => {
      expect(() => {
        controller
          .uploadFile(
            toFile(readFile(path + 'inputs/compulsory/InvoiceLine1M.json')),
          )
          .then((value) => {
            expect(value).toStrictEqual({
              timeEstimate: expect.any(Number),
              token: 'abc',
            });
          });
      }).not.toThrowError();

      expect(() => {
        controller.downloadFile('abc').then((value) => {
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
