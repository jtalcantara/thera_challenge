export enum OrderStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Canceled = 'Canceled',
}

export class OrderDTO {
    id!: string;

    cart!: Array<{
        product_id: string;

        price: number;
        
        quantity: number;
    }>;

    total_value!: number;

    status!: OrderStatus;

    createdAt!: Date;

    updatedAt!: Date;
}
