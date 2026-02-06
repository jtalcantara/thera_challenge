import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductService } from '@/modules/products/services/update.service';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { UpdateProductRequestDTO, UpdateProductResponseDTO, ProductDTO } from '@/modules/products/domain/dtos';

describe('UpdateProductService', () => {
  let service: UpdateProductService;
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
        UpdateProductService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateProductService>(UpdateProductService);
    repository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de Sucesso', () => {
    it('deve atualizar um produto com sucesso', async () => {
      // Arrange
      const productId = '1';
      const updateDto: UpdateProductRequestDTO = {
        name: 'Produto Atualizado',
        price: 150.00,
      };

      const updatedProduct: ProductDTO = {
        id: productId,
        name: 'Produto Atualizado',
        category: 'Categoria Original',
        description: 'Descrição Original',
        price: 150.00,
        quantity: 10,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      const expectedResponse: UpdateProductResponseDTO = new UpdateProductResponseDTO(updatedProduct);

      repository.update.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.update(productId, updateDto);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.name).toBe('Produto Atualizado');
      expect(result.price).toBe(150.00);
      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);
    });

    it('deve atualizar apenas o preço do produto', async () => {
      // Arrange
      const productId = '2';
      const updateDto: UpdateProductRequestDTO = {
        price: 200.00,
      };

      const updatedProduct: ProductDTO = {
        id: productId,
        name: 'Produto Original',
        category: 'Categoria Original',
        description: 'Descrição Original',
        price: 200.00,
        quantity: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      repository.update.mockResolvedValue(new UpdateProductResponseDTO(updatedProduct));

      // Act
      const result = await service.update(productId, updateDto);

      // Assert
      expect(result.price).toBe(200.00);
      expect(result.name).toBe('Produto Original');
      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);
    });

    it('deve atualizar apenas a quantidade do produto', async () => {
      // Arrange
      const productId = '3';
      const updateDto: UpdateProductRequestDTO = {
        quantity: 20,
      };

      const updatedProduct: ProductDTO = {
        id: productId,
        name: 'Produto Original',
        category: 'Categoria Original',
        description: 'Descrição Original',
        price: 100.00,
        quantity: 20,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      };

      repository.update.mockResolvedValue(new UpdateProductResponseDTO(updatedProduct));

      // Act
      const result = await service.update(productId, updateDto);

      // Assert
      expect(result.quantity).toBe(20);
      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);
    });
  });

  describe('Casos de Erro', () => {
    it('deve lançar erro quando o produto não existir', async () => {
      // Arrange
      const productId = '999';
      const updateDto: UpdateProductRequestDTO = {
        name: 'Produto Inexistente',
      };

      const error = new Error('Produto não encontrado');
      repository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.update(productId, updateDto)).rejects.toThrow(error);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando o repositório falhar', async () => {
      // Arrange
      const productId = '1';
      const updateDto: UpdateProductRequestDTO = {
        price: 150.00,
      };

      const error = new Error('Erro ao atualizar produto no banco de dados');
      repository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.update(productId, updateDto)).rejects.toThrow(error);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de validação do repositório', async () => {
      // Arrange
      const productId = '1';
      const updateDto: UpdateProductRequestDTO = {
        price: -10, // Preço inválido
      };

      const validationError = new Error('Preço inválido');
      repository.update.mockRejectedValue(validationError);

      // Act & Assert
      await expect(service.update(productId, updateDto)).rejects.toThrow(validationError);
    });
  });
});
