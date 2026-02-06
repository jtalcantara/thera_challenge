import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ListOrdersService } from '@/modules/orders/services';
import { ListOrdersRequestDTO, ListOrdersResponseDTO } from '@/modules/orders/domain/dtos';

@Controller('orders')
export class ListOrdersController {
  constructor(private readonly listOrdersService: ListOrdersService) {}

  @Get()
  async list(@Query() listOrdersRequest: ListOrdersRequestDTO): Promise<ListOrdersResponseDTO> {
      return this.listOrdersService.list(listOrdersRequest);
  }
}
