import { ProductDTO, CreateProductRequestDTO } from "./dtos";

export class Product implements ProductDTO {
    id!: string;
    name!: string;
    category!: string;
    description!: string;
    price!: number;
    quantity!: number;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: CreateProductRequestDTO) {
        Object.assign(this, props);
    }

    validateCreateProductRequest(): void {
        if (!this.name) {
            throw new Error('Name is required');
        }

        if (!this.price || this.price <= 0) {
            throw new Error('Price is required and must be greater than 0');
        }

        if (!this.quantity) {
            throw new Error('Quantity is required and must be greater than 0');
        }

        if (!this.category) {
            throw new Error('Category is required');
        }
    }

}