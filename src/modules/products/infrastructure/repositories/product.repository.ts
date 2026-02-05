import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO, ProductDTO, ListProductsRequestDTO, ListProductsResponseDTO } from '@/modules/products/domain/dtos';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IDatabaseClient } from '@/common/contracts/database-client.contract';
import { DatabaseConfig } from '@/infrastructure/database/database.config';

export class ProductRepository implements IProductRepository {
    private readonly baseUrl: string;

    constructor(
        @Inject('IDatabaseClient')
        private readonly databaseClient: IDatabaseClient,
    ) {
        this.baseUrl = DatabaseConfig.getEndpoint('products');
    }

    /**
     * Garante que a conexão com o banco está ativa antes de fazer requisições
     * @throws HttpException se o servidor não estiver disponível
     */
    private async ensureConnection(): Promise<void> {
        const isConnected = await this.databaseClient.ensureConnection();
        if (!isConnected) {
            throw new HttpException(
                {
                    message: 'Database connection unavailable. Please ensure json-server is running.',
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async findByName(name: string): Promise<ProductDTO | null> {
        await this.ensureConnection();

        try {
            // O json-server suporta queries como ?name=valor para buscar por campo
            // Usamos encodeURIComponent para tratar caracteres especiais no nome
            const url = `${this.baseUrl}?name=${encodeURIComponent(name)}`;

            // Usa o cliente de database injetado (desacoplado da implementação)
            const products = await this.databaseClient.get<ProductDTO[]>(url);

            // Retorna o primeiro produto encontrado ou null se não houver
            return products.length > 0 ? products[0] : null;
        } catch (error) {
            // Se for um HttpException, re-lança
            if (error instanceof HttpException) {
                throw error;
            }

            // Caso contrário, trata como erro de rede/conexão
            throw new HttpException(
                {
                    message: `Network error while searching product: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async create(data: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
        await this.ensureConnection();

        try {
            // Verifica se o produto já existe
            const existingProduct = await this.findByName(data.name);

            if (existingProduct) {
                throw new HttpException(
                    {
                        message: `Product already exists: ${data.name}`,
                        statusCode: HttpStatus.BAD_REQUEST,
                        error: 'Bad Request',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Prepara os dados do produto com timestamps
            const createProductRequest = {
                name: data.name,
                category: data.category,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Usa o cliente de database injetado (desacoplado da implementação)
            await this.databaseClient.post(this.baseUrl, createProductRequest);

            return new CreateProductResponseDTO();
        } catch (error) {
            // Se for um HttpException, re-lança
            if (error instanceof HttpException) {
                throw error;
            }

            // Caso contrário, trata como erro de rede/conexão
            throw new HttpException(
                {
                    message: `Network error while creating product: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async list(data: ListProductsRequestDTO): Promise<ListProductsResponseDTO> {
        await this.ensureConnection();

        try {
            // Define valores padrão para paginação
            const page = data.page ?? 1;
            const limit = data.limit ?? 10;

            // Constrói os query parameters para filtros (sem paginação)
            const filterParams: Record<string, string> = {};

            // Adiciona filtros se fornecidos
            if (data.priceFrom !== undefined && data.priceFrom !== null) {
                filterParams.price_gte = String(data.priceFrom);
            }

            if (data.priceTo !== undefined && data.priceTo !== null) {
                filterParams.price_lte = String(data.priceTo);
            }

            if (data.category) {
                filterParams.category = data.category;
            }

            // Primeira requisição: obtém o total de TODOS os produtos (sem filtros)
            // Usamos _page=1 e _limit=1 apenas para obter o header X-Total-Count
            const totalItemsParams: Record<string, string> = {
                _page: '1',
                _limit: '1',
            };
            const { responseHeaders: totalItemsHeaders } = await this.databaseClient.getWithHeaders<ProductDTO[]>(
                this.baseUrl,
                totalItemsParams
            );
            // Tenta obter o header (pode estar em diferentes cases)
            const totalItemsHeader = totalItemsHeaders.get('X-Total-Count') || 
                                   totalItemsHeaders.get('x-total-count') ||
                                   totalItemsHeaders.get('X-total-count');
            let totalItems = totalItemsHeader ? parseInt(totalItemsHeader, 10) : 0;
            
            // Se não conseguiu pelo header, faz uma requisição sem paginação para contar
            if (totalItems === 0) {
                const allProducts = await this.databaseClient.get<ProductDTO[]>(this.baseUrl);
                totalItems = allProducts.length;
            }

            // Segunda requisição: obtém o total de produtos filtrados (para calcular totalPages)
            const filteredTotalParams: Record<string, string> = { ...filterParams, _page: '1', _limit: '1' };
            const { responseHeaders: filteredTotalHeaders } = await this.databaseClient.getWithHeaders<ProductDTO[]>(
                this.baseUrl,
                filteredTotalParams
            );
            // Tenta obter o header (pode estar em diferentes cases)
            const filteredTotalHeader = filteredTotalHeaders.get('X-Total-Count') || 
                                       filteredTotalHeaders.get('x-total-count') ||
                                       filteredTotalHeaders.get('X-total-count');
            let totalFiltered = filteredTotalHeader ? parseInt(filteredTotalHeader, 10) : 0;
            
            // Se não conseguiu pelo header, faz uma requisição sem paginação para contar os filtrados
            if (totalFiltered === 0 && (Object.keys(filterParams).length > 0)) {
                const filteredProducts = await this.databaseClient.get<ProductDTO[]>(
                    this.baseUrl,
                    filterParams
                );
                totalFiltered = filteredProducts.length;
            } else if (totalFiltered === 0 && Object.keys(filterParams).length === 0) {
                // Se não há filtros, o total filtrado é igual ao total de itens
                totalFiltered = totalItems;
            }
            
            const totalPages = Math.ceil(totalFiltered / limit);

            // Terceira requisição: obtém os produtos filtrados e paginados
            const paginatedParams: Record<string, string> = { ...filterParams };
            
            // Adiciona parâmetros de paginação do json-server
            // O json-server usa _page (começa em 1) e _limit
            paginatedParams._page = String(page);
            paginatedParams._limit = String(limit);

            // Faz a requisição para obter os dados paginados
            const products = await this.databaseClient.get<ProductDTO[]>(
                this.baseUrl,
                paginatedParams
            );

            return new ListProductsResponseDTO(products, totalFiltered, page, limit, totalItems, totalPages);
        } catch (error) {
            // Se for um HttpException, re-lança
            if (error instanceof HttpException) {
                throw error;
            }

            // Caso contrário, trata como erro de rede/conexão
            throw new HttpException(
                {
                    message: `Network error while listing products: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
