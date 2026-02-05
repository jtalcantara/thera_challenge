import {
  Controller,
  Delete,
  Param,
} from '@nestjs/common';
import { DeleteProductService } from '@/modules/products/services';
import { DeleteProductResponseDTO } from '@/modules/products/domain/dtos';

@Controller('products')
export class DeleteProductController {
  constructor(private readonly deleteProductService: DeleteProductService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteProductResponseDTO> {
      return this.deleteProductService.delete(id);
  }
}
