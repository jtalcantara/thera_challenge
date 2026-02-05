import { Module } from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { ProductsController } from '@/modules/products/products.controller';
import { ProductRepository } from '@/modules/products/infrastructure/repositories';
import { JsonServerClient } from '@/infrastructure/database/json-server.client';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
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
  exports: [ProductsService],
})
export class ProductsModule {}
