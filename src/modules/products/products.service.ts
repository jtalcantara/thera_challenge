import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository  } from './domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO } from './domain/dtos';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  
  async create(data: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
    return this.productRepository.create(data);
  }
}
