import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/main/app.module';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS if needed
  app.enableCors();
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Apply global interceptor to format responses
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  
  // Apply global exception filter to format error responses
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const port = process.env.PORT || 3000;
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  
  console.log(`API is available on http://localhost:${port}/api`);
}

bootstrap();
