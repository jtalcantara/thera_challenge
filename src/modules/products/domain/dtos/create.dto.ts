import { ProductDTO } from "@/modules/products/domain/dtos/base.dto";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";

/**
 * DTO para criação de produto (Request)
 */
export class CreateProductRequestDTO implements Omit<ProductDTO, 'id' | 'createdAt' | 'updatedAt'> {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(3)
    category!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @MinLength(3)
    description: string = '';

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    @Min(0)
    price!: number;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsNotEmpty()
    @Min(0)
    quantity!: number;
}

/**
 * DTO para resposta de criação de produto (Response)
 */
export class CreateProductResponseDTO extends ProductDTO {
    constructor(props: ProductDTO) {
        super();
        Object.assign(this, props);
    }
}
