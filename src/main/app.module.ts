import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductsModule } from '@/modules/products/products.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { LoggingMiddleware } from '@/common/middlewares';

@Module({
  imports: [ProductsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*path');
  }
}
