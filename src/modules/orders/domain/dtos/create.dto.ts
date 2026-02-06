import { IsArray, ValidateNested, ArrayMinSize, IsString, IsNotEmpty, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";
import { OrderDTO } from "./base.dto";

/**
 * DTO para item do carrinho
 */
export class CartItemDTO {
    @IsString()
    @IsNotEmpty()
    product_id!: string;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    @Min(1)
    quantity!: number;
}

/**
 * DTO para criação de pedido (Request)
 */
export class CreateOrderRequestDTO {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CartItemDTO)
    cart!: CartItemDTO[];
}

/**
 * DTO para resposta de criação de pedido (Response)
 */
export class CreateOrderResponseDTO extends OrderDTO {
    constructor(order: OrderDTO) {
        super();
        Object.assign(this, order);
    }
}
