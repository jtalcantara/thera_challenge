import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { CreateProductService } from '@/modules/products/services';
import { CreateProductRequestDTO, CreateProductResponseDTO } from '@/modules/products/domain/dtos';

@Controller('products')
export class CreateProductController {
  constructor(private readonly createProductService: CreateProductService) {}

  @Post()
  async create(@Body() createProductRequest: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
      return this.createProductService.create(createProductRequest);
  }
}
