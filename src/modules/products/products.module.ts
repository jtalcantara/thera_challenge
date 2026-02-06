import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductService, ListProductsService, UpdateProductService, DeleteProductService } from '@/modules/products/services';
import { CreateProductController, ListProductsController, UpdateProductController, DeleteProductController } from '@/modules/products/controllers';
import { ProductRepository } from '@/modules/products/infrastructure/repositories';
import { ProductEntity } from '@/modules/products/infrastructure/database/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [CreateProductController, ListProductsController, UpdateProductController, DeleteProductController],
  providers: [
    CreateProductService,
    ListProductsService,
    UpdateProductService,
    DeleteProductService,
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
