import { Module } from '@nestjs/common';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';

@Module({
  controllers: [CreationController],
  providers: [CreationService],
})
export class CreationModule {}
