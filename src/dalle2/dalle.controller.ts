import { Body, Controller, Post } from '@nestjs/common';
import { DalleService } from './dalle.service';
import { ImageDataDto } from './image-data.dto';

@Controller('dalle')
export class DalleController {
  constructor(private dalle2Service: DalleService) {}

  @Post()
  async getDalleImage(@Body() imageDataDto: ImageDataDto): Promise<any> {
    return this.dalle2Service.getImageFromOpenAI(
      imageDataDto.model,
      imageDataDto.prompt,
      imageDataDto.amount,
    );
  }
}
