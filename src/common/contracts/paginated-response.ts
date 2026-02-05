export interface PaginatedResponse<T> {
    data: T[];
    itens: number;
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}