import { ProductDTO } from "@/modules/products/domain/dtos";

export enum OrderStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Canceled = 'Canceled',
}

export class OrderDTO {
    id!: string;

    products!: ProductDTO[];

    total_value!: number;

    status!: OrderStatus;

    createdAt!: Date;

    updatedAt!: Date;
}
