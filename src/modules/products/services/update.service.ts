import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository  } from '@/modules/products/domain/repositories/product.repository';
import { UpdateProductRequestDTO, UpdateProductResponseDTO } from '@/modules/products/domain/dtos';

@Injectable()
export class UpdateProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}
  
  async update(id: string, data: UpdateProductRequestDTO): Promise<UpdateProductResponseDTO> {
    return this.productRepository.update(id, data);
  }
}
