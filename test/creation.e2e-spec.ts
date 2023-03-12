import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreationModule } from './../src/creation/creation.module';
import { join } from 'path';
import { request, spec } from 'pactum';
import { eachLike, int, string } from 'pactum-matchers';

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

  describe('/creation/upload (POST)', () => {
    it('Success', () => {
      return spec()
        .post('/creation/upload')
        .withFile(
          'file',
          join(
            process.cwd(),
            'test/assets/inputs/compulsory/InvoiceLine1M.json',
          ),
        )
        .withJson({ type: 'json' })
        .expectStatus(201)
        .expectJsonMatchStrict({ timeEstimate: int(), token: string() });
    });
  });

  describe('/creation/download (GET)', () => {
    it('Success', async () => {
      const token = await spec()
        .post('/creation/upload')
        .withFile(
          'file',
          join(
            process.cwd(),
            'test/assets/inputs/compulsory/InvoiceLine1M.json',
          ),
        )
        .withJson({ type: 'json' })
        .expectStatus(201)
        .expectJsonMatchStrict({ timeEstimate: int(), token: string() })
        .returns('token');

      return spec()
        .get('/creation/download')
        .withQueryParams('token', token)
        .expectStatus(200);
    });

    it('Failure', async () => {
      const token = await spec()
        .post('/creation/upload')
        .withFile(
          'file',
          join(
            process.cwd(),
            'test/assets/inputs/others/SupplierCountryError.json',
          ),
        )
        .withJson({ type: 'json' })
        .expectStatus(201)
        .expectJsonMatchStrict({ timeEstimate: int(), token: string() })
        .returns('token');

      return spec()
        .get('/creation/download')
        .withQueryParams('token', token)
        .expectStatus(400);
    });
  });

  describe('/creation/upload/batch (POST)', () => {
    it('Success', () => {
      return spec()
        .post('/creation/upload/batch')
        .withFile(
          'files',
          join(
            process.cwd(),
            'test/assets/inputs/compulsory/InvoiceLine1M.json',
          ),
        )
        .withFile(
          'files',
          join(
            process.cwd(),
            'test/assets/inputs/compulsory/InvoiceLine2M.json',
          ),
        )
        .withJson({ type: 'json' })
        .expectStatus(201)
        .expectJsonMatchStrict({
          timeEstimate: int(),
          tokens: eachLike(string()),
        });
    });
  });
});
