import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import admin from 'firebase-admin';

async function bootstrap() {
  initializeFirebase();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

async function initializeFirebase() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require('../firebase-credentials.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('initialized firebase');
}

bootstrap();
