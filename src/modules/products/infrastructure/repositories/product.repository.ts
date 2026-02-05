import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, ProductDTO } from '@/modules/products/domain/dtos';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductRepository implements IProductRepository {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = getEndpoint('products');
    }

    /**
     * Garante que a conexão com o banco está ativa antes de fazer requisições
     */
    private async ensureConnection(): Promise<void> {
        const isConnected = await ensureDatabaseConnection();
        if (!isConnected) {
            throw new HttpException(
                'Database connection unavailable. Please ensure json-server is running.',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async findByName(name: string): Promise<ProductDTO | null> {
        await this.ensureConnection();

        // O json-server suporta queries como ?name=valor para buscar por campo
        // Usamos encodeURIComponent para tratar caracteres especiais no nome
        const url = `${this.baseUrl}?name=${encodeURIComponent(name)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new HttpException(
                `Failed to search product: ${response.statusText}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const products = await response.json() as ProductDTO[];
        
        // Retorna o primeiro produto encontrado ou null se não houver
        return products.length > 0 ? products[0] : null;
    }

    async create(product: CreateProductRequestDTO): Promise<boolean> {
        await this.ensureConnection();

        const existingProduct = await this.findByName(product.name);

        if (existingProduct) {
            throw new HttpException(`Product already exists: ${product.name}`, HttpStatus.BAD_REQUEST);
        }

        const createProductRequest = {
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createProductRequest),
        });

        if (!response.ok) {
            throw new HttpException(`Failed to create product: ${response.statusText}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return true;
    }
}
