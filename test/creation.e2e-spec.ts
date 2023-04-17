import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreationModule } from './../src/creation/creation.module';
import { join } from 'path';
import { request, spec } from 'pactum';
import { eachLike, int, string } from 'pactum-matchers';
import { readFileSync } from 'fs';
import { convert } from 'xmlbuilder2';

// Path to the unit being tested
const unitPath = '/api/creation';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CreationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0);
    const url = await app.getUrl();
    request.setBaseUrl(`${url.replace('[::1]', 'localhost')}`);
  });

  afterEach(async () => {
    await app.close();
  });

  describe.each(['json', 'xml', 'yaml'])('Test %s parsing', (parseType) => {
    describe(unitPath + '/upload (POST)', () => {
      it('Success', () => {
        return spec()
          .post(unitPath + '/upload')
          .withHeaders('type', `${parseType}`)
          .withFile(
            'file',
            join(
              process.cwd(),
              `test/assets/inputs/compulsory/InvoiceLine1M.${parseType}`,
            ),
          )
          .expectStatus(201)
          .expectJsonMatchStrict({ timeEstimate: int(), token: string() });
      });
    });

    describe(unitPath + '/upload/string (POST)', () => {
      it('Success', () => {
        return spec()
          .post(unitPath + '/upload/string')
          .withHeaders('type', `${parseType}`)
          .withBody({
            invoice: readFileSync(
              join(
                process.cwd(),
                `test/assets/inputs/compulsory/InvoiceLine1M.${parseType}`,
              ),
            ).toString(),
          })
          .expectStatus(201)
          .expectJsonMatchStrict({ timeEstimate: int(), token: string() });
      });
    });

    describe.each(['/download', '/download/string'])('Test %s', (route) => {
      describe(unitPath + route + ' (GET)', () => {
        it('Success', async () => {
          const token = await spec()
            .post(unitPath + '/upload')
            .withHeaders('type', `${parseType}`)
            .withFile(
              'file',
              join(
                process.cwd(),
                `test/assets/inputs/compulsory/InvoiceLine1M.${parseType}`,
              ),
            )
            .expectStatus(201)
            .expectJsonMatchStrict({ timeEstimate: int(), token: string() })
            .returns('token');

          const expectedOutput = convert(
            readFileSync(
              join(
                process.cwd(),
                'test/assets/outputs/compulsory/InvoiceLine1M.xml',
              ),
            ).toString(),
            { format: 'object' },
          );
          const actualOutput = convert(
            await spec()
              .get(unitPath + route)
              .withQueryParams('token', token)
              .expectStatus(200)
              .returns('res.body'),
            { format: 'object' },
          );

          expect(actualOutput).toStrictEqual(expectedOutput);
        });

        it('Failure', async () => {
          const token = await spec()
            .post(unitPath + '/upload')
            .withHeaders('type', `${parseType}`)
            .withFile(
              'file',
              join(
                process.cwd(),
                `test/assets/inputs/others/SupplierCountryError.${parseType}`,
              ),
            )
            .expectStatus(201)
            .expectJsonMatchStrict({ timeEstimate: int(), token: string() })
            .returns('token');

          return spec()
            .get(unitPath + '/download')
            .withQueryParams('token', token)
            .expectStatus(400);
        });
      });
    });

    describe(unitPath + '/upload/batch (POST)', () => {
      it('Success', async () => {
        const tokens = await spec()
          .post(unitPath + '/upload/batch')
          .withFile(
            'files',
            join(
              process.cwd(),
              `test/assets/inputs/compulsory/InvoiceLine1M.${parseType}`,
            ),
          )
          .withHeaders('type', `${parseType}`)
          .withFile(
            'files',
            join(
              process.cwd(),
              `test/assets/inputs/compulsory/InvoiceLine2M.${parseType}`,
            ),
          )
          .expectStatus(201)
          .expectJsonMatchStrict({
            timeEstimate: int(),
            tokens: eachLike(string()),
          })
          .returns('tokens');

        for (let i = 1; i < 3; i++) {
          const expectedOutput = convert(
            readFileSync(
              join(
                process.cwd(),
                `test/assets/outputs/compulsory/InvoiceLine${i}M.xml`,
              ),
            ).toString(),
            { format: 'object' },
          );
          const actualOutput = convert(
            await spec()
              .get(unitPath + '/download')
              .withQueryParams('token', tokens[i - 1])
              .expectStatus(200)
              .returns('res.body'),
            { format: 'object' },
          );

          expect(actualOutput).toStrictEqual(expectedOutput);
        }
      });
    });

    describe(unitPath + '/upload/batch/string (POST)', () => {
      it('Success', async () => {
        const tokens = await spec()
          .post(unitPath + '/upload/batch/string')
          .withBody({
            invoices: [
              readFileSync(
                join(
                  process.cwd(),
                  `test/assets/inputs/compulsory/InvoiceLine1M.${parseType}`,
                ),
              ).toString(),
              readFileSync(
                join(
                  process.cwd(),
                  `test/assets/inputs/compulsory/InvoiceLine2M.${parseType}`,
                ),
              ).toString(),
            ],
          })
          .withHeaders('type', `${parseType}`)
          .expectStatus(201)
          .expectJsonMatchStrict({
            timeEstimate: int(),
            tokens: eachLike(string()),
          })
          .returns('tokens');

        for (let i = 1; i < 3; i++) {
          const expectedOutput = convert(
            readFileSync(
              join(
                process.cwd(),
                `test/assets/outputs/compulsory/InvoiceLine${i}M.xml`,
              ),
            ).toString(),
            { format: 'object' },
          );
          const actualOutput = convert(
            await spec()
              .get(unitPath + '/download')
              .withQueryParams('token', tokens[i - 1])
              .expectStatus(200)
              .returns('res.body'),
            { format: 'object' },
          );

          expect(actualOutput).toStrictEqual(expectedOutput);
        }
      });
    });
  });
});
