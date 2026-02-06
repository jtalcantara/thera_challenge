import { Module } from '@nestjs/common';
import { CreateOrderService, ListOrdersService } from '@/modules/orders/services';
import { CreateOrderController, ListOrdersController } from '@/modules/orders/controllers';
import { OrderRepository } from '@/modules/orders/infrastructure/repositories';
import { ProductsModule } from '@/modules/products/products.module';

// TODO: Abstrair o cliente de database para que seja possível trocar de banco de dados
import { JsonServerClient } from '@/infrastructure/database/json-server.client';

@Module({
  imports: [ProductsModule],
  controllers: [CreateOrderController, ListOrdersController],
  providers: [
    CreateOrderService,
    ListOrdersService,
    {
      provide: 'IDatabaseClient',
      useClass: JsonServerClient,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
  exports: [CreateOrderService, ListOrdersService],
})
export class OrdersModule {}
