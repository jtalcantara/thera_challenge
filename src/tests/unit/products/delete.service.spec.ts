import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductService } from '@/modules/products/services/delete.service';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { DeleteProductResponseDTO } from '@/modules/products/domain/dtos';

describe('DeleteProductService', () => {
  let service: DeleteProductService;
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
        DeleteProductService,
        {
          provide: 'IProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteProductService>(DeleteProductService);
    repository = module.get('IProductRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de Sucesso', () => {
    it('deve deletar um produto com sucesso', async () => {
      // Arrange
      const productId = '1';
      const expectedResponse: DeleteProductResponseDTO = {
        success: true,
      };

      repository.delete.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.delete(productId);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.success).toBe(true);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(productId);
    });

    it('deve retornar sucesso ao deletar produto existente', async () => {
      // Arrange
      const productId = '2';
      const expectedResponse: DeleteProductResponseDTO = {
        success: true,
      };

      repository.delete.mockResolvedValue(expectedResponse);

      // Act
      const result = await service.delete(productId);

      // Assert
      expect(result.success).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('Casos de Erro', () => {
    it('deve lançar erro quando o produto não existir', async () => {
      // Arrange
      const productId = '999';
      const error = new Error('Produto não encontrado');

      repository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.delete(productId)).rejects.toThrow(error);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(productId);
    });

    it('deve lançar erro quando o repositório falhar', async () => {
      // Arrange
      const productId = '1';
      const error = new Error('Erro ao deletar produto no banco de dados');

      repository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.delete(productId)).rejects.toThrow(error);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro de conexão do repositório', async () => {
      // Arrange
      const productId = '1';
      const connectionError = new Error('Erro de conexão com o banco de dados');

      repository.delete.mockRejectedValue(connectionError);

      // Act & Assert
      await expect(service.delete(productId)).rejects.toThrow(connectionError);
    });
  });
});
