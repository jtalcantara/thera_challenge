import { describe, it, expect } from '@jest/globals';
import { ProductEntity, ProductProps } from '@/domain/entities/products';

const productMock: ProductProps = {
    id: '1',
    name: 'Notebook Dell Inspiron 15',
    category: 'Eletrônicos',
    description: 'Notebook Dell Inspiron 15 com processador Intel i5, 8GB RAM, 256GB SSD',
    price: 3500.00,
    quantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
};



describe('Success cases', () => {
    it('should be able to create a product with if initial values are valid', () => {

        const product = new ProductEntity(productMock);

        expect(product).toBeDefined();

    });
});

describe('Failure cases', () => {
    it('should not be able to create a product with invalid initial values', () => {

        const productMockInvalidName: ProductProps = {
            ...productMock,
            name: '',
        };

        expect(() => new ProductEntity(productMockInvalidName)).toThrow(new Error('Name is required'));

    });
});