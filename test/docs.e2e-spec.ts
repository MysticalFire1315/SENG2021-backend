import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { request, spec } from 'pactum';
import { join } from 'path';
import { DocsModule } from './../src/docs/docs.module';

// Path to the unit being tested
const unitPath = '/docs';
// Path to all documentation files
const docsPath = join(process.cwd(), 'src/docs/static/');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DocsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0);
    const url = await app.getUrl();
    request.setBaseUrl(`${url.replace('[::1]', 'localhost')}`);
  });

  afterEach(async () => {
    await app.close();
  });

  it('Test changelog', async () => {
    return spec()
      .get(unitPath + '/changelog')
      .expectStatus(200)
      .expectBody(readFileSync(docsPath + 'changelog.txt').toString());
  });

  it('Test schema/creation/upload', async () => {
    return spec()
      .get(unitPath + '/schema/creation/upload')
      .expectStatus(200)
      .expectBody(
        JSON.parse(readFileSync(docsPath + 'input.schema.json').toString()),
      );
  });

  it('Test guide', async () => {
    return spec()
      .get(unitPath + '/guide')
      .expectStatus(200)
      .expectBody(readFileSync(docsPath + 'guide.html').toString());
  });
});
