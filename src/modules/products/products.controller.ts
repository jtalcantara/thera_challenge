import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ProductsService } from '@/modules/products/products.service';
import { CreateProductRequestDTO, CreateProductResponseDTO } from './domain/dtos';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductRequest: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
      return this.productsService.create(createProductRequest);
  }
}
