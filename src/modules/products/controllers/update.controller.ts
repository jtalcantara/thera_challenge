import {
  Controller,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { UpdateProductService } from '@/modules/products/services';
import { UpdateProductRequestDTO, UpdateProductResponseDTO } from '@/modules/products/domain/dtos';

@Controller('products')
export class UpdateProductController {
  constructor(private readonly updateProductService: UpdateProductService) {}

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductRequest: UpdateProductRequestDTO): Promise<UpdateProductResponseDTO> {
      return this.updateProductService.update(id, updateProductRequest);
  }
}
