import { IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";
import { ProductDTO } from "./base.dto";
import { PaginatedResponse } from "@/common/contracts/paginated-response";

export class ListProductsRequestDTO {
    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;

    @IsOptional()
    @MaxLength(255)
    @MinLength(3)
    category?: string;
}

export class ListProductsResponseDTO implements PaginatedResponse<ProductDTO> {
    constructor(data: ProductDTO[], total: number, page: number = 1, limit: number = 10) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }

    data: ProductDTO[];
    total: number;
    page: number;
    limit: number;
}