import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreationModule } from './creation/creation.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [CreationModule, DocsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
