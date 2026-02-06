import { Test, TestingModule } from '@nestjs/testing';
import { ListProductsService } from '@/modules/products/services/list.service';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { ListProductsRequestDTO, ListProductsResponseDTO, ProductDTO } from '@/modules/products/domain/dtos';

describe('ListProductsService', () => {
  let service: ListProductsService;
  let repository: jest.Mocked<IProductRepository>;

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
        ListProductsService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ListProductsService>(ListProductsService);
    repository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de Sucesso', () => {
    it('deve listar produtos com paginação padrão', async () => {
      // Arrange
      const requestDto: ListProductsRequestDTO = {
        page: 1,
        limit: 10,
      };

      const mockProducts: ProductDTO[] = [
        {
          id: '1',
          name: 'Produto 1',
          category: 'Categoria 1',
          description: 'Descrição 1',
          price: 100.00,
          quantity: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Produto 2',
          category: 'Categoria 2',
          description: 'Descrição 2',
          price: 200.00,
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const expectedResponse: ListProductsResponseDTO = new ListProductsResponseDTO(
        mockProducts,
        mockProducts.length,
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

    it('deve listar produtos com paginação customizada', async () => {
      // Arrange
      const requestDto: ListProductsRequestDTO = {
        page: 2,
        limit: 5,
      };

      const mockProducts: ProductDTO[] = [
        {
          id: '6',
          name: 'Produto 6',
          category: 'Categoria 6',
          description: 'Descrição 6',
          price: 600.00,
          quantity: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const expectedResponse: ListProductsResponseDTO = new ListProductsResponseDTO(
        mockProducts,
        mockProducts.length,
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

    it('deve retornar lista vazia quando não houver produtos', async () => {
      // Arrange
      const requestDto: ListProductsRequestDTO = {
        page: 1,
        limit: 10,
      };

      const expectedResponse: ListProductsResponseDTO = new ListProductsResponseDTO(
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
      const requestDto: ListProductsRequestDTO = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Erro ao buscar produtos no banco de dados');
      repository.list.mockRejectedValue(error);

      // Act & Assert
      await expect(service.list(requestDto)).rejects.toThrow(error);
      expect(repository.list).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conexão do repositório', async () => {
      // Arrange
      const requestDto: ListProductsRequestDTO = {
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
