import { IsNumber, IsOptional, Max, Min } from "class-validator";   
import { Type } from "class-transformer";
import { ProductDTO } from "./base.dto";
import { PaginatedResponse } from "@/common/contracts/paginated-response";

export class ListProductsRequestDTO {
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
        items: number, 
        page: number = 1, 
        total: number = 1,
        pages: number = 1,
    ) {
        this.data = data;
        this.items = items;
        this.total = total;
        this.page = page;
        this.pages = pages;
    }

    data: ProductDTO[];
    items: number;
    page: number;
    pages: number;
    total: number;
}