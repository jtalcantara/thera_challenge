export interface PaginatedResponse<T> {
    data: T[];
    items: number;
    page: number;
    pages: number;
    total: number;
}