/**
 * EXEMPLO DE IMPLEMENTAÇÃO CONCRETA DO REPOSITÓRIO
 * 
 * Esta é uma implementação de exemplo que mostra como implementar
 * o contrato IProductRepository usando o json-server.
 * 
 * Para usar, renomeie este arquivo removendo o ".example" e implemente
 * os métodos conforme necessário.
 */

import { IProductRepository, ProductFilters } from '@/domain/repositories/product.repository';
import { ProductEntity } from '@/domain/entities/products';
import { getEndpoint } from '@/infrastructure/database/connection';

export class ProductRepository implements IProductRepository {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = getEndpoint('produtos');
    }

    async list(filters?: ProductFilters): Promise<ProductEntity[]> {
        // TODO: Implementar lógica de busca com filtros
        // Por enquanto, ignoramos os filtros e retornamos todos os produtos
        void filters; // Evita warning de variável não usada
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json() as any[];
        
        // Converter dados do banco para ProductEntity
        return data.map((item: any) => this.mapToEntity(item));
    }

    async findById(id: string): Promise<ProductEntity | null> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return this.mapToEntity(data);
    }

    async create(product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.mapToDatabase(product)),
        });
        const data = await response.json();
        return this.mapToEntity(data);
    }

    async update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.mapToDatabase(product)),
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return this.mapToEntity(data);
    }

    async delete(id: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    }

    /**
     * Mapeia dados do banco (formato JSON) para ProductEntity
     */
    private mapToEntity(data: any): ProductEntity {
        return new ProductEntity({
            id: data.id,
            name: data.nome || data.name,
            category: data.categoria || data.category,
            description: data.descricao || data.description,
            price: data.preco || data.price,
            quantity: data.quantidade_estoque || data.quantity,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        });
    }

    /**
     * Mapeia ProductEntity para formato do banco (JSON)
     */
    private mapToDatabase(entity: Partial<ProductEntity>): any {
        return {
            nome: entity.name,
            categoria: entity.category,
            descricao: entity.description,
            preco: entity.price,
            quantidade_estoque: entity.quantity,
        };
    }
}
