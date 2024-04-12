import 'dotenv/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateImageDataDto } from './update-image-data.dto';
import * as fs from 'fs';
import * as uniqid from 'uniqid';
import axios from 'axios';
import { join } from 'path';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';

@Injectable()
export class DalleService {
  async createImageFromOpenAI(
    collection: string,
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

      const imageUrlList = response.data;

      const filepath = await this.downloadImage(imageUrlList[0].url);
      const storage = getStorage();
      const myRef = ref(storage, 'images/mountains.jpg');

      const downloadUrl = await getDownloadURL(myRef);
      console.log(downloadUrl);

      return this.saveImageInFirestore(collection, model, prompt, imageUrlList);
    } catch (error: any) {
      throw error;
    }
  }

  async downloadImage(url): Promise<string> {
    if (!fs.existsSync(join(process.cwd(), '/tmp/')))
      fs.mkdirSync(join(process.cwd(), '/tmp/'));

    const filepath = join(process.cwd(), `/tmp/img_${uniqid()}.png`);
    const writer = fs.createWriteStream(filepath);
    const result = await axios.get(url, { responseType: 'stream' });
    await result.data.pipe(writer);
    return filepath;
  }

  async saveImageInFirestore(
    collection: string,
    model: string,
    prompt: string,
    imageUrlList: any[],
  ): Promise<any> {
    try {
      const imageData = {
        model,
        prompt,
        imageUrlList,
      };
      const newImageDataRef = await FirebaseService.getFirestore()
        .collection(collection)
        .add(imageData);

      const result = await newImageDataRef.get();
      return result.data();
    } catch (error: any) {
      throw error;
    }
  }

  async getImages(collection: string): Promise<any> {
    try {
      const snapshot = await FirebaseService.getFirestore()
        .collection(collection)
        .get();

      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error: any) {
      throw error;
    }
  }

  async updateImage(updateImageDataDto: UpdateImageDataDto) {
    const { amount, collection, document, model, prompt } = updateImageDataDto;

    try {
      const validModel = this.validateModel(model);
      const validPrompt = this.validatePrompt(prompt);
      const validAmount = this.validateAmount(amount, model);

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.images.generate({
        model: validModel,
        prompt: validPrompt,
        n: validAmount,
        size: '1024x1024',
      });

      const imageUrlList = response.data;

      const imageData = {
        model,
        prompt,
        imageUrlList,
      };

      await FirebaseService.getFirestore()
        .collection(collection)
        .doc(document)
        .set(imageData);

      const updateImageDataRef = await FirebaseService.getFirestore()
        .collection(collection)
        .doc(document)
        .get();

      return updateImageDataRef.data();
    } catch (error: any) {
      throw error;
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
