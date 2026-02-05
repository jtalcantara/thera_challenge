import { Module } from '@nestjs/common';
import { CreateProductService, ListProductsService } from '@/modules/products/services';
import { CreateProductController, ListProductsController } from '@/modules/products/controllers';
import { ProductRepository } from '@/modules/products/infrastructure/repositories';
import { JsonServerClient } from '@/infrastructure/database/json-server.client';

@Module({
  controllers: [CreateProductController, ListProductsController],
  providers: [
    CreateProductService,
    ListProductsService,
    // Fornece a implementação do cliente de database
    // Para trocar de banco, basta alterar JsonServerClient por outra implementação
    {
      provide: 'IDatabaseClient',
      useClass: JsonServerClient,
    },
    // Fornece o repositório de produtos
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [CreateProductService, ListProductsService],
})
export class ProductsModule {}
