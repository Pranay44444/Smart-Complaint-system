import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global response envelope
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global error handler
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS for the frontend
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

