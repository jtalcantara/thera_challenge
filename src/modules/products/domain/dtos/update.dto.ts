import { ProductDTO } from "@/modules/products/domain/dtos/base.dto";
import { IsOptional, IsString, IsNumber, MaxLength, MinLength, Min } from "class-validator";
import { Type } from "class-transformer";

/**
 * DTO para atualização de produto (Request)
 * Todos os campos são opcionais para permitir atualização parcial
 */
export class UpdateProductRequestDTO {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @MinLength(3)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @MinLength(3)
    category?: string;

    @IsString()
    @MaxLength(255)
    @MinLength(3)
    @IsOptional()
    description?: string;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsOptional()
    @Min(0)
    price?: number;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @IsOptional()
    @Min(0)
    quantity?: number;
}

/**
 * DTO para resposta de atualização de produto (Response)
 */
export class UpdateProductResponseDTO extends ProductDTO {
    constructor(props: ProductDTO) {
        super();
        Object.assign(this, props);
    }
}
