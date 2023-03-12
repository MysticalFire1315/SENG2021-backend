import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreationModule } from './../src/creation/creation.module';
import { join } from 'path';
import { request, spec } from 'pactum';

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

  it('/creation/upload (POST)', () => {
    return spec()
      .post('/creation/upload')
      .withFile(
        'file',
        join(process.cwd(), 'test/assets/inputs/compulsory/InvoiceLine1M.json'),
      )
      .expectStatus(201)
      .expectBody({ timeEstimate: expect.any(Number), token: 'abc' });
  });

  it('/creation/download (GET)', async () => {
    await spec()
      .post('/creation/upload')
      .withFile(
        'file',
        join(process.cwd(), 'test/assets/inputs/compulsory/InvoiceLine1M.json'),
      )
      .expectStatus(201)
      .expectBody({ timeEstimate: expect.any(Number), token: 'abc' });

    return spec()
      .get('/creation/download')
      .withQueryParams('token', 'abc')
      .expectStatus(200);
  });
});
