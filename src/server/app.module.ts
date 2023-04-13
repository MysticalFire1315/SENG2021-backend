import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreationModule } from './creation/creation.module';
import { DocsModule } from './docs/docs.module';
import { FrontendModule } from './frontend/frontend.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [CreationModule, DocsModule, FrontendModule, ViewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
