import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { IOrderRepository } from '@/modules/orders/domain/repositories/order.repository';
import { CartItemDTO, CreateOrderRequestDTO, CreateOrderResponseDTO, OrderStatus } from '@/modules/orders/domain/dtos';
import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { ProductDTO } from '@/modules/products/domain/dtos';

@Injectable()
export class CreateOrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) { }


  /**
   * Cria um novo pedido
   * @param data - Dados do pedido a ser criado
   * Regras de negócio:
   * - Validar cada produto do carrinho
   * - Calcular o valor total do pedido
   * - Criar o pedido
   * - Reduzir o estoque dos produtos
   * @returns Promise com o pedido criado
   */
  async create(data: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO> {
    const validatedProducts: ProductDTO[] = [];
    const cartItemsWithProducts: Array<{ cartItem: CartItemDTO; product: ProductDTO }> = [];
    let totalValue = 0;

    // 1 - Validar produtos e armazenar para uso posterior
    for (const cartItem of data.cart) {
      const product: ProductDTO | null = await this.productRepository.findById(cartItem.product_id);

      // Regra: Verificar se o produto existe
      if (!product) {
        throw new HttpException(
          {
            message: `Product not found: ${cartItem.product_id}`,
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Regra: Verificar se o produto tem estoque suficiente
      if (cartItem.quantity > product.quantity) {
        throw new HttpException(
          {
            message: `Insufficient stock for product ${product.name} (${product.id}). Available: ${product.quantity}, Requested: ${cartItem.quantity}`,
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2 - Calcular o valor total do item
      totalValue += product.price * cartItem.quantity;

      validatedProducts.push(product);
      cartItemsWithProducts.push({ cartItem, product });
    }

    // 3 - Criar o pedido
    const order = await this.orderRepository.create({
      products: validatedProducts,
      total_value: totalValue,
      status: OrderStatus.Pending,
    });

    // 4 - Reduzir o estoque dos produtos (após criar o pedido com sucesso)
    // Usa os produtos já buscados, evitando busca duplicada
    for (const { cartItem, product } of cartItemsWithProducts) {
      const newQuantity = product.quantity - cartItem.quantity;
      await this.productRepository.update(cartItem.product_id, { quantity: newQuantity });
    }

    return order;
  }
}
