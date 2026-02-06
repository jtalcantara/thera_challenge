import { IOrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { CreateOrderResponseDTO, ListOrdersRequestDTO, ListOrdersResponseDTO, OrderDTO } from '@/modules/orders/domain/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/modules/orders/infrastructure/database/order.entity';

export class OrderRepository implements IOrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) {}

    /**
     * Converte OrderEntity para OrderDTO
     */
    private entityToDTO(entity: OrderEntity): OrderDTO {
        return {
            id: entity.id,
            cart: entity.cart,
            total_value: Number(entity.total_value),
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    /**
     * Cria um novo pedido no banco de dados
     * Recebe os dados já validados e processados pelo service
     * @param order - Dados do pedido já processados (sem validações de negócio)
     */
    async create(order: Omit<OrderDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateOrderResponseDTO> {
        const orderEntity = this.orderRepository.create({
            cart: order.cart,
            total_value: order.total_value,
            status: order.status,
        });

        const savedOrder = await this.orderRepository.save(orderEntity);
        const orderDTO = this.entityToDTO(savedOrder);

        return new CreateOrderResponseDTO(orderDTO);
    }

    async list(data: ListOrdersRequestDTO): Promise<ListOrdersResponseDTO> {
        const { page = 1, limit = 10 } = data;
        const skip = (page - 1) * limit;

        const [orders, total] = await this.orderRepository.findAndCount({
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });

        const totalPages = Math.ceil(total / limit);
        const orderDTOs = orders.map((order: OrderEntity) => this.entityToDTO(order));

        return new ListOrdersResponseDTO(
            orderDTOs,
            orderDTOs.length,
            page,
            total,
            totalPages,
        );
    }
}
