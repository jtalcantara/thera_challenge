import { Module } from '@nestjs/common';
import { CreateProductService, ListProductsService, UpdateProductService } from '@/modules/products/services';
import { CreateProductController, ListProductsController, UpdateProductController } from '@/modules/products/controllers';
import { ProductRepository } from '@/modules/products/infrastructure/repositories';

// TODO: Abstrair o cliente de database para que seja possível trocar de banco de dados
import { JsonServerClient } from '@/infrastructure/database/json-server.client';

@Module({
  controllers: [CreateProductController, ListProductsController, UpdateProductController],
  providers: [
    CreateProductService,
    ListProductsService,
    UpdateProductService,
    {
      provide: 'IDatabaseClient',
      useClass: JsonServerClient,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [CreateProductService, ListProductsService, UpdateProductService],
})
export class ProductsModule {}
