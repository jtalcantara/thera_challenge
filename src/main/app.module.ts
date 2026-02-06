import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '@/modules/products/products.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { LoggingMiddleware } from '@/common/middlewares';
import { getTypeOrmConfig } from '@/infrastructure/orm/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as variáveis de ambiente disponíveis globalmente
      envFilePath: '.env', // Caminho do arquivo .env
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*path');
  }
}
