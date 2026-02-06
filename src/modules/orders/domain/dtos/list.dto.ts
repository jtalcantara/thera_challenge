import { IsNumber, IsOptional, Max, Min } from "class-validator";   
import { Type } from "class-transformer";
import { OrderDTO } from "./base.dto";
import { PaginatedResponse } from "@/common/contracts/paginated-response";

export class ListOrdersRequestDTO {
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

export class ListOrdersResponseDTO implements PaginatedResponse<OrderDTO> {
    constructor(
        data: OrderDTO[], 
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

    data: OrderDTO[];
    items: number;
    page: number;
    pages: number;
    total: number;
}
