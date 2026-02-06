import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { ListProductsRequestDTO, ListProductsResponseDTO } from '@/modules/products/domain/dtos';

@Injectable()
export class ListProductsService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  
  async list(data: ListProductsRequestDTO): Promise<ListProductsResponseDTO> {
    return this.productRepository.list(data);
  }
}
