import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreationModule } from './creation/creation.module';
import { DocsModule } from './docs/docs.module';
import { FrontendModule } from './frontend/frontend.module';

@Module({
  imports: [CreationModule, DocsModule, FrontendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
