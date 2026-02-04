import { CreateProductRequestDTO, ProductDTO } from '../dtos';

/**
 * Contrato do repositório de produtos
 * Define as operações que o domínio precisa para trabalhar com produtos
 * 
 * Este contrato pertence ao domínio e deve ser implementado por camadas externas
 * (infraestrutura), seguindo o princípio de Inversão de Dependência (SOLID)
 */
export interface IProductRepository {
    /**
     * Cria um novo produto
     * @param product - Dados do produto a ser criado
     * @returns Promise com ProductEntity criado
     */
    create(product: CreateProductRequestDTO): Promise<boolean>;

    /**
     * Busca um produto pelo nome
     * @param name - Nome do produto a ser buscado
     * @returns Promise com o produto encontrado ou null se não existir
     */
    findByName(name: string): Promise<ProductDTO | null>;
}