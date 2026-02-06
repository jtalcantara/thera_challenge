import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { CreateOrderService } from '@/modules/orders/services';
import { CreateOrderRequestDTO, CreateOrderResponseDTO } from '@/modules/orders/domain/dtos';

@Controller('orders')
export class CreateOrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Post()
  async create(@Body() createOrderRequest: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO> {
      return this.createOrderService.create(createOrderRequest);
  }
}
