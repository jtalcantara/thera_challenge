import { HttpException, HttpStatus } from "@nestjs/common";
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
            throw new HttpException('Product name is required', HttpStatus.BAD_REQUEST);
        }

        if (!this.price || this.price <= 0) {
            throw new HttpException('Product price is required and must be greater than 0', HttpStatus.BAD_REQUEST);
        }

        if (!this.quantity) {
            throw new HttpException('Product quantity is required and must be greater than 0', HttpStatus.BAD_REQUEST);
        }

        if (!this.category) {
            throw new HttpException('Product category is required', HttpStatus.BAD_REQUEST);
        }
    }

}