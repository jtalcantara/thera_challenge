import { ProductEntity } from '../entities/products';

/**
 * Contrato do repositório de produtos
 * Define as operações que o domínio precisa para trabalhar com produtos
 * 
 * Este contrato pertence ao domínio e deve ser implementado por camadas externas
 * (infraestrutura), seguindo o princípio de Inversão de Dependência (SOLID)
 */
export interface IProductRepository {
    /**
     * Lista todos os produtos, opcionalmente com filtros
     * @param filters - Filtros opcionais para buscar produtos
     * @returns Promise com array de ProductEntity
     */
    list(filters?: ProductFilters): Promise<ProductEntity[]>;

    /**
     * Busca um produto por ID
     * @param id - ID do produto
     * @returns Promise com ProductEntity ou null se não encontrado
     */
    findById(id: string): Promise<ProductEntity | null>;

    /**
     * Cria um novo produto
     * @param product - Dados do produto a ser criado
     * @returns Promise com ProductEntity criado
     */
    create(product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity>;

    /**
     * Atualiza um produto existente
     * @param id - ID do produto
     * @param product - Dados parciais do produto a ser atualizado
     * @returns Promise com ProductEntity atualizado ou null se não encontrado
     */
    update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;

    /**
     * Remove um produto
     * @param id - ID do produto
     * @returns Promise com boolean indicando sucesso
     */
    delete(id: string): Promise<boolean>;
}

/**
 * Filtros opcionais para busca de produtos
 */
export type ProductFilters = {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    name?: string;
    inStock?: boolean; // true para produtos com estoque > 0
};
