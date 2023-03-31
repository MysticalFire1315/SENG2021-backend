import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../http-exception.filter';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';

@Module({
  controllers: [CreationController],
  providers: [
    CreationService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CreationModule {}
