import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductEntity } from '@/modules/products/infrastructure/database/product.entity';
import { OrderEntity } from '@/modules/orders/infrastructure/database/order.entity';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'thera_challenge',
    entities: [ProductEntity, OrderEntity],
    synchronize: process.env.NODE_ENV !== 'production', // true em desenvolvimento, false em produção
    logging: process.env.NODE_ENV === 'development',
  };
};
