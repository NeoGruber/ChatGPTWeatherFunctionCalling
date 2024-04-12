import { Module } from '@nestjs/common';
import { DalleService } from './dalle.service';
import { DalleController } from './dalle.controller';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  providers: [DalleService, FirebaseService],
  controllers: [DalleController],
})
export class DalleModule {}
