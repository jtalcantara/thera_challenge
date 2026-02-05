import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO, ProductDTO } from '@/modules/products/domain/dtos';
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
}
