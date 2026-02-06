import { Test, TestingModule } from '@nestjs/testing';
import { ListOrdersService } from '@/modules/orders/services/list.service';
import { IOrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { ListOrdersRequestDTO, ListOrdersResponseDTO, OrderDTO, OrderStatus } from '@/modules/orders/domain/dtos';

describe('ListOrdersService', () => {
  let service: ListOrdersService;
  let repository: jest.Mocked<IOrderRepository>;

  const mockOrderRepository = {
    create: jest.fn(),
    list: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListOrdersService,
        {
          provide: 'IOrderRepository',
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<ListOrdersService>(ListOrdersService);
    repository = module.get('IOrderRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de Sucesso', () => {
    it('deve listar pedidos com paginação padrão', async () => {
      // Arrange
      const requestDto: ListOrdersRequestDTO = {
        page: 1,
        limit: 10,
      };

      const mockOrders: OrderDTO[] = [
        {
          id: 'order-1',
          cart: [
            {
              product_id: '1',
              price: 100.00,
              quantity: 2,
            },
          ],
          total_value: 200.00,
          status: OrderStatus.Pending,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'order-2',
          cart: [
            {
              product_id: '2',
              price: 50.00,
              quantity: 3,
            },
          ],
          total_value: 150.00,
          status: OrderStatus.Completed,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const expectedResponse: ListOrdersResponseDTO = new ListOrdersResponseDTO(
        mockOrders,
        mockOrders.length,
        1,
        2,
        1,
      );

      repository.list.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.list(requestDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(result.items).toBe(2);
      expect(result.total).toBe(2);
      expect(repository.list).toHaveBeenCalledTimes(1);
      expect(repository.list).toHaveBeenCalledWith(requestDto);
    });

    it('deve listar pedidos com paginação customizada', async () => {
      // Arrange
      const requestDto: ListOrdersRequestDTO = {
        page: 2,
        limit: 5,
      };

      const mockOrders: OrderDTO[] = [
        {
          id: 'order-6',
          cart: [
            {
              product_id: '3',
              price: 75.00,
              quantity: 4,
            },
          ],
          total_value: 300.00,
          status: OrderStatus.Pending,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const expectedResponse: ListOrdersResponseDTO = new ListOrdersResponseDTO(
        mockOrders,
        mockOrders.length,
        2,
        10,
        2,
      );

      repository.list.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.list(requestDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.page).toBe(2);
      expect(repository.list).toHaveBeenCalledWith(requestDto);
    });

    it('deve retornar lista vazia quando não houver pedidos', async () => {
      // Arrange
      const requestDto: ListOrdersRequestDTO = {
        page: 1,
        limit: 10,
      };

      const expectedResponse: ListOrdersResponseDTO = new ListOrdersResponseDTO(
        [],
        0,
        1,
        0,
        0,
      );

      repository.list.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.list(requestDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('Casos de Erro', () => {
    it('deve lançar erro quando o repositório falhar', async () => {
      // Arrange
      const requestDto: ListOrdersRequestDTO = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Erro ao buscar pedidos no banco de dados');
      repository.list.mockRejectedValue(error);

      // Act & Assert
      await expect(service.list(requestDto)).rejects.toThrow(error);
      expect(repository.list).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conexão do repositório', async () => {
      // Arrange
      const requestDto: ListOrdersRequestDTO = {
        page: 1,
        limit: 10,
      };

      const connectionError = new Error('Erro de conexão com o banco de dados');
      repository.list.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(service.list(requestDto)).rejects.toThrow(connectionError);
    });
  });
});
