import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  controllers: [ViewController],
  providers: [ViewService, ConfigService],
})
export class ViewModule {}
