import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
  });
  const config = new DocumentBuilder()
    .setTitle('API E-invoice Creator')
    .setDescription('Creates an E-invoice in UBL XML Format')
    .setVersion('1.0')
    .addTag('E-invoice Creation')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
