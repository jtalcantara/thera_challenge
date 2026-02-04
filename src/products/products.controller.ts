import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductEntity } from '@/domain/entities/products';

@Controller('produtos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar produto';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Query() filters: ProductFiltersDto): Promise<ProductEntity[]> {
    const productFilters = {
      category: filters.categoria,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      name: filters.name,
      inStock: filters.inStock,
    };

    return this.productsService.findAll(productFilters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.productsService.update(id, updateProductDto);
    if (!product) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.productsService.remove(id);
    if (!deleted) {
      throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Produto deletado com sucesso' };
  }
}
