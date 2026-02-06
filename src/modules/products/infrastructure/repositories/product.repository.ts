import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO, ProductDTO, ListProductsRequestDTO, ListProductsResponseDTO, UpdateProductResponseDTO, UpdateProductRequestDTO, DeleteProductResponseDTO } from '@/modules/products/domain/dtos';
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

    async findById(id: string): Promise<ProductDTO | null> {
        await this.ensureConnection();

        const product = await this.databaseClient.get<ProductDTO>(`${this.baseUrl}/${id}`);

        return product;
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

    async update(id: string, data: UpdateProductRequestDTO): Promise<UpdateProductResponseDTO> {
        await this.ensureConnection();

        // Busca o produto existente para preservar id, createdAt e updatedAt
        const existingProduct = await this.databaseClient.get<ProductDTO>(`${this.baseUrl}/${id}`);

        if (!existingProduct) {
            throw new HttpException(
                {
                    message: `Product not found: ${id}`,
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        const updateData: ProductDTO = {
            id: existingProduct.id, // Preserva o id original
            name: data.name ?? existingProduct.name,
            category: data.category ?? existingProduct.category,
            description: data.description ?? existingProduct.description,
            price: data.price ?? existingProduct.price,
            quantity: data.quantity ?? existingProduct.quantity ?? 0,
            createdAt: existingProduct.createdAt, // Preserva createdAt original
            updatedAt: new Date(), // Atualiza updatedAt para agora
        };

        const dbResponse = await this.databaseClient.put(`${this.baseUrl}/${id}`, updateData);

        if (!dbResponse) {
            throw new HttpException(
                {
                    message: `Product not found: ${id}`,
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        return new UpdateProductResponseDTO(updateData);
    }

    async delete(id: string): Promise<DeleteProductResponseDTO> {
        await this.ensureConnection();

        // Verifica se o produto existe antes de deletar
        const existingProduct = await this.databaseClient.get<ProductDTO>(`${this.baseUrl}/${id}`);

        if (!existingProduct) {
            throw new HttpException(
                {
                    message: `Product not found: ${id}`,
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.databaseClient.delete(`${this.baseUrl}/${id}`);

        return new DeleteProductResponseDTO();
    }
}
