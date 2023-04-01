import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { convert } from 'xmlbuilder2';
import { CreationService } from './creation.service';
import { testAssetsPath } from '../spec.config';

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

  describe.each(['json', 'xml', 'yaml'])('Test %s parsing', (parseType) => {
    describe('upload', () => {
      it('Upload success', () => {
        expect(() => {
          service
            .invoiceUpload(
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

      it('Tokens should be different', async () => {
        const output1 = await service.invoiceUpload(
          toFile(
            readFile(path + `inputs/compulsory/InvoiceLine1M.${parseType}`),
          ),
          parseType,
        );
        expect(output1).toStrictEqual({
          timeEstimate: expect.any(Number),
          token: expect.any(String),
        });
        const token1 = output1.token;

        const output2 = await service.invoiceUpload(
          toFile(
            readFile(path + `inputs/compulsory/InvoiceLine2M.${parseType}`),
          ),
          parseType,
        );
        expect(output2).toStrictEqual({
          timeEstimate: expect.any(Number),
          token: expect.any(String),
        });
        const token2 = output2.token;

        expect(token1).not.toStrictEqual(token2);
      });
    });

    describe('download', () => {
      it('Download success', async () => {
        const output = await service.invoiceUpload(
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
          service.invoiceDownload(token).then((value) => {
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

      it('Download failed', async () => {
        const output = await service.invoiceUpload(
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
          async () => await service.invoiceDownload(token),
        ).rejects.toThrowError();
      });

      it('Download success from batch', async () => {
        const output = await service.invoiceUploadBatch(
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
          service.invoiceDownload(tokens[0]).then((value) => {
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
          service.invoiceDownload(tokens[1]).then((value) => {
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
    });

    describe('uploadBatch', () => {
      it('Upload success', () => {
        expect(() => {
          service
            .invoiceUploadBatch(
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
    });
  });
});
