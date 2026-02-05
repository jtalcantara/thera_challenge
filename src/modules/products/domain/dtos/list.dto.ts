import { IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { ProductDTO } from "./base.dto";
import { PaginatedResponse } from "@/common/contracts/paginated-response";

export class ListProductsRequestDTO {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    priceFrom?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    priceTo?: number;

    @IsOptional()
    @MaxLength(255)
    @MinLength(3)
    category?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(1)
    page?: number = 1;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

export class ListProductsResponseDTO implements PaginatedResponse<ProductDTO> {
    constructor(
        data: ProductDTO[], 
        itens: number, 
        page: number = 1, 
        limit: number = 10,
        totalItems?: number,
        totalPages?: number
    ) {
        this.data = data;
        this.itens = itens;
        this.page = page;
        this.limit = limit;
        this.totalItems = totalItems ?? itens; 
        this.totalPages = totalPages ?? Math.ceil(itens / limit); 
    }

    data: ProductDTO[];
    itens: number;
    page: number;
    limit: number;
    totalItems: number; 
    totalPages: number; 
}