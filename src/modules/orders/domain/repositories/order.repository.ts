import { CreateOrderResponseDTO, ListOrdersRequestDTO, ListOrdersResponseDTO, OrderDTO } from '@/modules/orders/domain/dtos';

/**
 * Contrato do repositório de pedidos
 * Define as operações que o domínio precisa para trabalhar com pedidos
 * 
 * Este contrato pertence ao domínio e deve ser implementado por camadas externas
 * (infraestrutura), seguindo o princípio de Inversão de Dependência (SOLID)
 */
export interface IOrderRepository {
    /**
     * Cria um novo pedido
     * Recebe os dados já validados e processados pelo service
     * @param order - Dados do pedido já processados (sem validações de negócio)
     * @returns Promise com OrderEntity criado
     */
    create(order: Omit<OrderDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreateOrderResponseDTO>;

    /**
     * Busca pedidos paginados
     * @param request - Filtros de busca
     * @returns Promise com a lista de pedidos paginados
     */
    list(request: ListOrdersRequestDTO): Promise<ListOrdersResponseDTO>;
}
