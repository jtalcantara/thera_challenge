import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository  } from '@/modules/products/domain/repositories/product.repository';
import { DeleteProductResponseDTO } from '@/modules/products/domain/dtos';

@Injectable()
export class DeleteProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  
  async delete(id: string): Promise<DeleteProductResponseDTO> {
    return this.productRepository.delete(id);
  }
}
