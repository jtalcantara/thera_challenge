import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository  } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO } from '@/modules/products/domain/dtos';

@Injectable()
export class CreateProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  
  async create(data: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
    return this.productRepository.create(data);
  }
}
