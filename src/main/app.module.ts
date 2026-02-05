import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductsModule } from '@/modules/products/products.module';
import { LoggingMiddleware } from '@/common/middlewares';

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
