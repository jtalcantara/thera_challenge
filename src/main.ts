import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';
import { HttpResponseFilter } from '@/common/filters/http-response.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS if needed
  app.enableCors();
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Apply global interceptor to format responses
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  
  // Apply global response filter to format responses
  app.useGlobalFilters(new HttpResponseFilter());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`API is available on http://localhost:${port}/api`);
}

bootstrap();
