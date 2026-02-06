import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateOrderService, ListOrdersService } from '@/modules/orders/services';
import { CreateOrderController, ListOrdersController } from '@/modules/orders/controllers';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories';
import { ProductsModule } from '@/modules/products/products.module';
import { OrderEntity } from '@/modules/orders/infrastructure/database/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ProductsModule,
  ],
  controllers: [CreateOrderController, ListOrdersController],
  providers: [
    CreateOrderService,
    ListOrdersService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
  exports: [CreateOrderService, ListOrdersService],
})
export class OrdersModule {}
