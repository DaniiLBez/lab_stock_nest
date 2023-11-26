import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from './config';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle(config.swaggerApiTitle)
    .setDescription(config.swaggerApiDescription)
    .setVersion('1.0')
    .addTag(config.swaggerApiTitle)
    .build();

  mongoose
    .connect('mongodb://127.0.0.1:27017/lab5')
    .then(() => console.log(`Connected to database`));

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: '*' });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
