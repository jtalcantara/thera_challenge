import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from '@/modules/orders/domain/dtos/base.dto';

export interface CartItem {
  product_id: string;
  price: number;
  quantity: number;
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'json' })
  cart!: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_value!: number;

  @Column({ 
    type: 'varchar', 
    length: 20,
    default: OrderStatus.Pending 
  })
  status!: OrderStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
