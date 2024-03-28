import 'dotenv/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class DalleService {
  async getImageFromOpenAI(
    model: string,
    prompt: string,
    amount: number,
  ): Promise<any> {
    try {
      model = this.validateModel(model);
      prompt = this.validatePrompt(prompt);
      amount = this.validateAmount(amount, model);

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.images.generate({
        model,
        prompt,
        n: amount,
        size: '1024x1024',
      });

      const image_url = response.data;

      return image_url;
    } catch (error: any) {
      return error;
    }
  }

  validatePrompt(prompt: string): string {
    if (prompt != '') return prompt;
    throw new HttpException('prompt is not valid', HttpStatus.BAD_REQUEST);
  }

  validateModel(model: string): string {
    if (model == 'dall-e-2' || model == 'dall-e-3') return model;
    throw new HttpException('model is not valid', HttpStatus.BAD_REQUEST);
  }

  validateAmount(amount: number, model: string): number {
    if (model == 'dall-e-3') return 1;
    return amount;
  }
}
