import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreationModule } from './creation/creation.module';

@Module({
  imports: [CreationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
