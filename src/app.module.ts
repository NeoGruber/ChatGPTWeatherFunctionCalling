import { Module } from '@nestjs/common';
import { DalleModule } from './dalle2/dalle.module';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  imports: [DalleModule],
  controllers: [],
  providers: [FirebaseService],
})
export class AppModule {}
