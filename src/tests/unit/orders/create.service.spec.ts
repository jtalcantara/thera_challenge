import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CreateOrderService } from '@/modules/orders/services/create.service';
import { IOrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateOrderRequestDTO, CreateOrderResponseDTO, OrderStatus } from '@/modules/orders/domain/dtos';
import { ProductDTO } from '@/modules/products/domain/dtos';

describe('CreateOrderService', () => {
  let service: CreateOrderService;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockOrderRepository = {
    create: jest.fn(),
    list: jest.fn(),
  };

  const mockProductRepository = {
    create: jest.fn(),
    findByName: jest.fn(),
    findById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderService,
        {
          provide: 'IOrderRepository',
          useValue: mockOrderRepository,
        },
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<CreateOrderService>(CreateOrderService);
    orderRepository = module.get('IOrderRepository');
    productRepository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de Sucesso', () => {
    it('deve criar um pedido com sucesso', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '1',
            quantity: 2,
          },
        ],
      };

      const mockProduct: ProductDTO = {
        id: '1',
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição',
        price: 100.00,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockOrder: CreateOrderResponseDTO = {
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
      };

      productRepository.findById.mockResolvedValue(mockProduct);
      orderRepository.create.mockResolvedValue(mockOrder);
      productRepository.update.mockResolvedValue({} as any);

      // Act
      const result = await service.create(createOrderDto);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(result.total_value).toBe(200.00);
      expect(result.status).toBe(OrderStatus.Pending);
      expect(productRepository.findById).toHaveBeenCalledWith('1');
      expect(orderRepository.create).toHaveBeenCalledTimes(1);
      expect(productRepository.update).toHaveBeenCalledWith('1', { quantity: 8 });
    });

    it('deve criar um pedido com múltiplos produtos', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '1',
            quantity: 2,
          },
          {
            product_id: '2',
            quantity: 3,
          },
        ],
      };

      const mockProduct1: ProductDTO = {
        id: '1',
        name: 'Produto 1',
        category: 'Categoria 1',
        description: 'Descrição 1',
        price: 100.00,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockProduct2: ProductDTO = {
        id: '2',
        name: 'Produto 2',
        category: 'Categoria 2',
        description: 'Descrição 2',
        price: 50.00,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockOrder: CreateOrderResponseDTO = {
        id: 'order-2',
        cart: [
          {
            product_id: '1',
            price: 100.00,
            quantity: 2,
          },
          {
            product_id: '2',
            price: 50.00,
            quantity: 3,
          },
        ],
        total_value: 350.00, // (100 * 2) + (50 * 3)
        status: OrderStatus.Pending,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productRepository.findById
        .mockResolvedValueOnce(mockProduct1)
        .mockResolvedValueOnce(mockProduct2);
      orderRepository.create.mockResolvedValue(mockOrder);
      productRepository.update.mockResolvedValue({} as any);

      // Act
      const result = await service.create(createOrderDto);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(result.total_value).toBe(350.00);
      expect(result.cart).toHaveLength(2);
      expect(productRepository.findById).toHaveBeenCalledTimes(2);
      expect(productRepository.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('Casos de Erro', () => {
    it('deve lançar erro quando produto não for encontrado', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '999',
            quantity: 1,
          },
        ],
      };

      productRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(HttpException);
      await expect(service.create(createOrderDto)).rejects.toThrow(
        expect.objectContaining({
          status: HttpStatus.NOT_FOUND,
        }),
      );

      expect(productRepository.findById).toHaveBeenCalledWith('999');
      expect(orderRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando estoque for insuficiente', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '1',
            quantity: 15, // Mais do que o estoque disponível
          },
        ],
      };

      const mockProduct: ProductDTO = {
        id: '1',
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição',
        price: 100.00,
        quantity: 10, // Estoque disponível
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productRepository.findById.mockResolvedValue(mockProduct);

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(HttpException);
      await expect(service.create(createOrderDto)).rejects.toThrow(
        expect.objectContaining({
          status: HttpStatus.BAD_REQUEST,
        }),
      );

      expect(productRepository.findById).toHaveBeenCalledWith('1');
      expect(orderRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando múltiplos produtos tiverem estoque insuficiente', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '1',
            quantity: 2,
          },
          {
            product_id: '2',
            quantity: 25, // Mais do que o estoque disponível
          },
        ],
      };

      const mockProduct1: ProductDTO = {
        id: '1',
        name: 'Produto 1',
        category: 'Categoria 1',
        description: 'Descrição 1',
        price: 100.00,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockProduct2: ProductDTO = {
        id: '2',
        name: 'Produto 2',
        category: 'Categoria 2',
        description: 'Descrição 2',
        price: 50.00,
        quantity: 20, // Estoque disponível menor que solicitado
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productRepository.findById
        .mockResolvedValueOnce(mockProduct1)
        .mockResolvedValueOnce(mockProduct2);

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(HttpException);
      await expect(service.create(createOrderDto)).rejects.toThrow(
        expect.objectContaining({
          status: HttpStatus.BAD_REQUEST,
        }),
      );
    });

    it('deve lançar erro quando o repositório de pedidos falhar', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '1',
            quantity: 2,
          },
        ],
      };

      const mockProduct: ProductDTO = {
        id: '1',
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição',
        price: 100.00,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productRepository.findById.mockResolvedValue(mockProduct);
      const error = new Error('Erro ao criar pedido no banco de dados');
      orderRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(error);
      expect(productRepository.findById).toHaveBeenCalled();
      expect(orderRepository.create).toHaveBeenCalled();
    });

    it('deve lançar erro quando o repositório de produtos falhar ao atualizar estoque', async () => {
      // Arrange
      const createOrderDto: CreateOrderRequestDTO = {
        cart: [
          {
            product_id: '1',
            quantity: 2,
          },
        ],
      };

      const mockProduct: ProductDTO = {
        id: '1',
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição',
        price: 100.00,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockOrder: CreateOrderResponseDTO = {
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
      };

      productRepository.findById.mockResolvedValue(mockProduct);
      orderRepository.create.mockResolvedValue(mockOrder);
      const error = new Error('Erro ao atualizar estoque');
      productRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createOrderDto)).rejects.toThrow(error);
      expect(orderRepository.create).toHaveBeenCalled();
      expect(productRepository.update).toHaveBeenCalled();
    });
  });
});
