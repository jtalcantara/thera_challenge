import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository  } from './domain/repositories/product.repository.interface';
import { CreateProductRequestDTO, CreateProductResponseDTO } from './domain/dtos';
import { Product } from './domain/product';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async create(data: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
    const product = new Product(data);
    product.validateCreateProductRequest();
    return this.productRepository.create(product);
  }
}
