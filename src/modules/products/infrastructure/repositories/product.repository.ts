import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO, ProductDTO, ListProductsRequestDTO, ListProductsResponseDTO } from '@/modules/products/domain/dtos';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { IDatabaseClient } from '@/common/contracts/database-client.contract';
import { DatabaseConfig } from '@/infrastructure/database/database.config';
import { PaginatedResponse } from '@/common/contracts/paginated-response';

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

        const url = `${this.baseUrl}?name=${encodeURIComponent(name)}`;

        const products = await this.databaseClient.get<ProductDTO[]>(url);

        return products.length > 0 ? products[0] : null;
    }

    async create(data: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
        await this.ensureConnection();

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

        const createProductRequest = {
            name: data.name,
            category: data.category,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await this.databaseClient.post(this.baseUrl, createProductRequest);

        return new CreateProductResponseDTO();
    }

    async list(data: ListProductsRequestDTO): Promise<ListProductsResponseDTO> {
        await this.ensureConnection();

        const { page = 1, limit = 10 } = data;

        const paginationParams: Record<string, string> = {
            _page: String(page),
            _per_page: String(limit),
        };

        const result = await this.databaseClient.getWithHeaders<PaginatedResponse<ProductDTO>>(
            this.baseUrl,
            paginationParams
        );

        return new ListProductsResponseDTO(
            result.data,
            result.data.length,
            page,
            result.items,
            result.pages,
        );
    }
}
