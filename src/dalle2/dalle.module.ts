import { Module } from '@nestjs/common';
import { DalleService } from './dalle.service';
import { DalleController } from './dalle.controller';

@Module({
  providers: [DalleService],
  controllers: [DalleController],
})
export class DalleModule {}
