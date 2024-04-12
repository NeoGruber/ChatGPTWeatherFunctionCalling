import { Body, Controller, Post, Get, Query, Put } from '@nestjs/common';
import { DalleService } from './dalle.service';
import { ImageDataDto } from './image-data.dto';
import { UpdateImageDataDto } from './update-image-data.dto';

@Controller('dalle')
export class DalleController {
  constructor(private dalle2Service: DalleService) {}

  @Post()
  async createDalleImage(@Body() imageDataDto: ImageDataDto): Promise<any> {
    return this.dalle2Service.createImageFromOpenAI(
      imageDataDto.collection,
      imageDataDto.model,
      imageDataDto.prompt,
      imageDataDto.amount,
    );
  }

  @Get()
  async getDalleImages(@Query() query: any): Promise<any> {
    return this.dalle2Service.getImages(query.collection);
  }

  @Put()
  async updateDalleImage(
    @Body() updateImageDataDto: UpdateImageDataDto,
  ): Promise<any> {
    return this.dalle2Service.updateImage(updateImageDataDto);
  }
}
