import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/main/app.module';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS if needed
  app.enableCors();
  
  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Apply logging middleware directly using Express
  app.use((req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    next();
  });
  
  // Apply global interceptor to format responses
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  
  // Apply global exception filter to format error responses
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  
  console.log(`API is available on http://localhost:${port}/api`);
}

bootstrap();
