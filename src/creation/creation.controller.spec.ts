import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { convert } from 'xmlbuilder2';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';
import { testAssetsPath } from '../spec.config';

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

  describe.each(['json', 'xml', 'yaml'])('Test %s parsing', (parseType) => {
    describe('upload', () => {
      it('Upload file success', async () => {
        expect(() => {
          controller
            .uploadFile(
              toFile(
                readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
              ),
              parseType,
            )
            .then((value) => {
              expect(value).toStrictEqual({
                timeEstimate: expect.any(Number),
                token: expect.any(String),
              });
            });
        }).not.toThrowError();
      });

      it('Upload string success', async () => {
        expect(() => {
          controller
            .uploadString(
              readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
              parseType,
            )
            .then((value) => {
              expect(value).toStrictEqual({
                timeEstimate: expect.any(Number),
                token: expect.any(String),
              });
            });
        }).not.toThrowError();
      });
    });

    describe('download', () => {
      it('Download file success', async () => {
        const output = await controller.uploadFile(
          toFile(
            readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
          ),
          parseType,
        );
        expect(output).toStrictEqual({
          timeEstimate: expect.any(Number),
          token: expect.any(String),
        });
        const token = output.token;

        expect(() => {
          controller.downloadFile(token).then((value) => {
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

      it('Download string success', async () => {
        const output = await controller.uploadString(
          readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
          parseType,
        );
        expect(output).toStrictEqual({
          timeEstimate: expect.any(Number),
          token: expect.any(String),
        });
        const token = output.token;

        expect(() => {
          controller.downloadString(token).then((actualOutput) => {
            const expectedOutput = readFile(
              path + 'outputs/compulsory/InvoiceLine1M.xml',
            );
            const actualObj = convert(actualOutput, { format: 'object' });
            const expectedObj = convert(expectedOutput, { format: 'object' });
            expect(actualObj).toStrictEqual(expectedObj);
          });
        }).not.toThrowError();
      });

      it('Download file failed', async () => {
        const output = await controller.uploadFile(
          toFile(
            readFile(path + `inputs/others/SupplierCountryError.${parseType}`),
          ),
          parseType,
        );
        expect(output).toStrictEqual({
          timeEstimate: expect.any(Number),
          token: expect.any(String),
        });
        const token = output.token;

        expect(
          async () => await controller.downloadFile(token),
        ).rejects.toThrowError(HttpException);
      });

      it('Download string failed', async () => {
        const output = await controller.uploadString(
          readFile(path + `inputs/others/SupplierCountryError.${parseType}`),
          parseType,
        );
        expect(output).toStrictEqual({
          timeEstimate: expect.any(Number),
          token: expect.any(String),
        });
        const token = output.token;

        expect(
          async () => await controller.downloadString(token),
        ).rejects.toThrowError(HttpException);
      });

      it('Download file success from batch', async () => {
        const output = await controller.uploadFileBatch(
          [
            toFile(
              readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
            ),
            toFile(
              readFile(path + `inputs/compulsory/InvoiceLine2M.${parseType}`),
            ),
          ],
          parseType,
        );
        expect(output).toStrictEqual({
          timeEstimate: expect.any(Number),
          tokens: expect.any(Array<string>),
        });
        const tokens = output.tokens;

        expect(() => {
          controller.downloadFile(tokens[0]).then((value) => {
            const expectedOutput = readFile(
              path + 'outputs/compulsory/InvoiceLine1M.xml',
            );
            const actualOutput = value.getStream().read().toString();

            const actualObj = convert(actualOutput, { format: 'object' });
            const expectedObj = convert(expectedOutput, { format: 'object' });
            expect(actualObj).toStrictEqual(expectedObj);
          });
        }).not.toThrowError();

        expect(() => {
          controller.downloadFile(tokens[1]).then((value) => {
            const expectedOutput = readFile(
              path + 'outputs/compulsory/InvoiceLine2M.xml',
            );
            const actualOutput = value.getStream().read().toString();

            const actualObj = convert(actualOutput, { format: 'object' });
            const expectedObj = convert(expectedOutput, { format: 'object' });
            expect(actualObj).toStrictEqual(expectedObj);
          });
        }).not.toThrowError();
      });

      it('Download string success from batch', async () => {
        const output = await controller.uploadStringBatch(
          [
            readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
            readFile(path + `inputs/compulsory/InvoiceLine2M.${parseType}`),
          ],
          parseType,
        );
        expect(output).toStrictEqual({
          timeEstimate: expect.any(Number),
          tokens: expect.any(Array<string>),
        });
        const tokens = output.tokens;

        expect(() => {
          controller.downloadString(tokens[0]).then((actualOutput) => {
            const expectedOutput = readFile(
              path + 'outputs/compulsory/InvoiceLine1M.xml',
            );

            const actualObj = convert(actualOutput, { format: 'object' });
            const expectedObj = convert(expectedOutput, { format: 'object' });
            expect(actualObj).toStrictEqual(expectedObj);
          });
        }).not.toThrowError();

        expect(() => {
          controller.downloadString(tokens[1]).then((actualOutput) => {
            const expectedOutput = readFile(
              path + 'outputs/compulsory/InvoiceLine2M.xml',
            );

            const actualObj = convert(actualOutput, { format: 'object' });
            const expectedObj = convert(expectedOutput, { format: 'object' });
            expect(actualObj).toStrictEqual(expectedObj);
          });
        }).not.toThrowError();
      });
    });

    describe('uploadBatch', () => {
      it('Upload file success', () => {
        expect(() => {
          controller
            .uploadFileBatch(
              [
                toFile(
                  readFile(
                    path + `inputs/compulsory/InvoiceLine1M.${parseType}`,
                  ),
                ),
                toFile(
                  readFile(
                    path + `inputs/compulsory/InvoiceLine2M.${parseType}`,
                  ),
                ),
              ],
              parseType,
            )
            .then((value) => {
              expect(value).toStrictEqual({
                timeEstimate: expect.any(Number),
                tokens: expect.any(Array<string>),
              });
            });
        }).not.toThrowError();
      });

      it('Upload string success', () => {
        expect(() => {
          controller
            .uploadStringBatch(
              [
                readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
                readFile(path + `inputs/compulsory/InvoiceLine2M.${parseType}`),
              ],
              parseType,
            )
            .then((value) => {
              expect(value).toStrictEqual({
                timeEstimate: expect.any(Number),
                tokens: expect.any(Array<string>),
              });
            });
        }).not.toThrowError();
      });
    });
  });
});
