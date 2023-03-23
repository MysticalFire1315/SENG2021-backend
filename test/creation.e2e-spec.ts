import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreationModule } from './../src/creation/creation.module';
import { join } from 'path';
import { request, spec } from 'pactum';
import { eachLike, int, string } from 'pactum-matchers';

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

    describe(unitPath + '/download (GET)', () => {
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

        return spec()
          .get(unitPath + '/download')
          .withQueryParams('token', token)
          .expectStatus(200);
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

    describe(unitPath + '/upload/batch (POST)', () => {
      it('Success', () => {
        return spec()
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
          });
      });
    });
  });
});
