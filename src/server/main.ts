import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CreationModule } from './creation/creation.module';
import { DocsModule } from './docs/docs.module';
import * as morgan from 'morgan';
import { createWriteStream } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    cors: {
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    },
  });
  app.use(
    morgan('common', {
      stream: createWriteStream(
        join(process.cwd(), 'src/docs/static/requests.log'),
        { flags: 'a' },
      ),
    }),
  );

  const APP_NAME = process.env.npm_package_name;
  const APP_VERSION = process.env.npm_package_version;

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(`The ${APP_NAME} API description`)
    .setVersion(APP_VERSION)
    .build();
  const options: SwaggerDocumentOptions = {
    include: [CreationModule, DocsModule],
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs/swagger', app, document);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
