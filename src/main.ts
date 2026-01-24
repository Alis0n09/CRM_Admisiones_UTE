import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exceptions.filters';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.enableCors({ origin: true, credentials: true }); // Frontend (ej. localhost:5173) puede consumir la API

  // Habilita acceso público a la carpeta /public
  app.useStaticAssets(join(__dirname, '..', 'public'), {
  prefix: '/public/',
})

  await app.listen(3000);
}
bootstrap();
