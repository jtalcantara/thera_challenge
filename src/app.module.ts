import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
