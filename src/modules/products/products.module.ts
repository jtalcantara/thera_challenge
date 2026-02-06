import { Module } from '@nestjs/common';
import { CreateProductService, ListProductsService, UpdateProductService, DeleteProductService } from '@/modules/products/services';
import { CreateProductController, ListProductsController, UpdateProductController, DeleteProductController } from '@/modules/products/controllers';
import { ProductRepository } from '@/modules/products/infrastructure/repositories';

// TODO: Abstrair o cliente de database para que seja possível trocar de banco de dados
import { JsonServerClient } from '@/infrastructure/database/json-server.client';

@Module({
  controllers: [CreateProductController, ListProductsController, UpdateProductController, DeleteProductController],
  providers: [
    CreateProductService,
    ListProductsService,
    UpdateProductService,
    DeleteProductService,
    {
      provide: 'IDatabaseClient',
      useClass: JsonServerClient,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [
    CreateProductService,
    ListProductsService,
    UpdateProductService,
    DeleteProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
})
export class ProductsModule {}
