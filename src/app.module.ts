import { Module } from '@nestjs/common';
import { DalleModule } from './dalle2/dalle.module';

@Module({
  imports: [DalleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
