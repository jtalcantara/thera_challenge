import { IOrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { CreateOrderResponseDTO, ListOrdersRequestDTO, ListOrdersResponseDTO, OrderDTO } from '@/modules/orders/domain/dtos';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IDatabaseClient } from '@/common/contracts/database-client.contract';
import { DatabaseConfig } from '@/infrastructure/database/database.config';
import { PaginatedResponse } from '@/common/contracts/paginated-response';

export class OrderRepository implements IOrderRepository {
    private readonly baseUrl: string;

    constructor(
        @Inject('IDatabaseClient')
        private readonly databaseClient: IDatabaseClient,
    ) {
        this.baseUrl = DatabaseConfig.getEndpoint('orders');
    }

    /**
     * Garante que a conexão com o banco está ativa antes de fazer requisições
     * @throws HttpException se o servidor não estiver disponível
     */
    private async ensureConnection(): Promise<void> {
        const isConnected = await this.databaseClient.ensureConnection();
        if (!isConnected) {
            throw new HttpException(
                {
                    message: 'Database connection unavailable. Please ensure json-server is running.',
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    /**
     * Cria um novo pedido no banco de dados
     * Recebe os dados já validados e processados pelo service
     * @param order - Dados do pedido já processados (sem validações de negócio)
     */
    async create(order: Omit<OrderDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateOrderResponseDTO> {
        await this.ensureConnection();

        const createOrderRequest = {
            ...order,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await this.databaseClient.post<OrderDTO>(this.baseUrl, createOrderRequest);

        return new CreateOrderResponseDTO(result);
    }

    async list(data: ListOrdersRequestDTO): Promise<ListOrdersResponseDTO> {
        await this.ensureConnection();

        const { page = 1, limit = 10 } = data;

        const paginationParams: Record<string, string> = {
            _page: String(page),
            _per_page: String(limit),
        };

        const result = await this.databaseClient.getWithHeaders<PaginatedResponse<OrderDTO>>(
            this.baseUrl,
            paginationParams
        );

        return new ListOrdersResponseDTO(
            result.data,
            result.data.length,
            page,
            result.items,
            result.pages,
        );
    }
}
