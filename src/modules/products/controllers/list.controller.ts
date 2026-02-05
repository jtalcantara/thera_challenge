import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ListProductsService } from '@/modules/products/services';
import { ListProductsRequestDTO, ListProductsResponseDTO } from '@/modules/products/domain/dtos';

@Controller('products')
export class ListProductsController {
  constructor(private readonly listProductsService: ListProductsService) {}

  @Get()
  async list(@Query() listProductsRequest: ListProductsRequestDTO): Promise<ListProductsResponseDTO> {
      return this.listProductsService.list(listProductsRequest);
  }
}
