import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { ListOrdersRequestDTO, ListOrdersResponseDTO } from '@/modules/orders/domain/dtos';

@Injectable()
export class ListOrdersService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}
  
  async list(data: ListOrdersRequestDTO): Promise<ListOrdersResponseDTO> {
    return this.orderRepository.list(data);
  }
}
