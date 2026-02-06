import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductService } from '@/modules/products/services/create.service';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO, ProductDTO } from '@/modules/products/domain/dtos';

describe('CreateProductService', () => {
  let service: CreateProductService;
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
        CreateProductService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<CreateProductService>(CreateProductService);
    repository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de Sucesso', () => {
    it('deve criar um produto com sucesso', async () => {
      // Arrange
      const createProductDto: CreateProductRequestDTO = {
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição do produto teste',
        price: 99.99,
        quantity: 10,
      };

      const expectedProduct: ProductDTO = {
        id: '1',
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição do produto teste',
        price: 99.99,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResponse: CreateProductResponseDTO = expectedProduct as CreateProductResponseDTO;

      repository.create.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.create(createProductDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createProductDto);
    });

    it('deve criar um produto sem descrição (opcional)', async () => {
      // Arrange
      const createProductDto: CreateProductRequestDTO = {
        name: 'Produto Sem Descrição',
        category: 'Categoria Teste',
        description: '',
        price: 50.00,
        quantity: 5,
      };

      const expectedProduct: ProductDTO = {
        id: '2',
        name: 'Produto Sem Descrição',
        category: 'Categoria Teste',
        description: '',
        price: 50.00,
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockResolvedValue(expectedProduct as CreateProductResponseDTO);

      // Act
      const result = await service.create(createProductDto);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Casos de Erro', () => {
    it('deve lançar erro quando o repositório falhar', async () => {
      // Arrange
      const createProductDto: CreateProductRequestDTO = {
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição',
        price: 99.99,
        quantity: 10,
      };

      const error = new Error('Erro ao criar produto no banco de dados');
      repository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createProductDto)).rejects.toThrow(error);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação do repositório', async () => {
      // Arrange
      const createProductDto: CreateProductRequestDTO = {
        name: 'Produto Teste',
        category: 'Categoria Teste',
        description: 'Descrição',
        price: 99.99,
        quantity: 10,
      };

      const validationError = new Error('Dados inválidos');
      repository.create.mockRejectedValue(validationError);

      // Act & Assert
      await expect(service.create(createProductDto)).rejects.toThrow(validationError);
    });
  });
});
