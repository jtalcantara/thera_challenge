import { ProductEntity } from "@/domain/entities/products";
import { IProductRepository, ProductFilters } from "@/domain/repositories";

export class ListProductsUseCase {
    constructor(private readonly productRepository: IProductRepository) {}

    async execute(filters?: ProductFilters): Promise<ProductEntity[]> {
        return this.productRepository.list(filters);
    }
}