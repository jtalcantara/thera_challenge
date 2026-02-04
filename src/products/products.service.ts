import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository, ProductFilters } from '@/domain/repositories/product.repository';
import { ProductEntity } from '@/domain/entities/products';
import { ListProductsUseCase } from '@/domain/usecases/products/list';
import { GetProductDetailsUseCase } from '@/domain/usecases/products/details';

@Injectable()
export class ProductsService {
  private readonly listProductsUseCase: ListProductsUseCase;
  private readonly getProductDetailsUseCase: GetProductDetailsUseCase;

  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {
    this.listProductsUseCase = new ListProductsUseCase(this.productRepository);
    this.getProductDetailsUseCase = new GetProductDetailsUseCase(this.productRepository);
  }

  async findAll(filters?: ProductFilters): Promise<ProductEntity[]> {
    return this.listProductsUseCase.execute(filters);
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.getProductDetailsUseCase.execute(id);
  }

  async create(createProductDto: {
    nome: string;
    categoria: string;
    descricao: string;
    preco: number;
    quantidade_estoque: number;
  }): Promise<ProductEntity> {
    return this.productRepository.create({
      name: createProductDto.nome,
      category: createProductDto.categoria,
      description: createProductDto.descricao,
      price: createProductDto.preco,
      quantity: createProductDto.quantidade_estoque,
    } as Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>);
  }

  async update(
    id: string,
    updateProductDto: Partial<{
      nome: string;
      categoria: string;
      descricao: string;
      preco: number;
      quantidade_estoque: number;
    }>,
  ): Promise<ProductEntity | null> {
    const updateData: Partial<ProductEntity> = {};
    
    if (updateProductDto.nome !== undefined) updateData.name = updateProductDto.nome;
    if (updateProductDto.categoria !== undefined) updateData.category = updateProductDto.categoria;
    if (updateProductDto.descricao !== undefined) updateData.description = updateProductDto.descricao;
    if (updateProductDto.preco !== undefined) updateData.price = updateProductDto.preco;
    if (updateProductDto.quantidade_estoque !== undefined) updateData.quantity = updateProductDto.quantidade_estoque;

    return this.productRepository.update(id, updateData);
  }

  async remove(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
