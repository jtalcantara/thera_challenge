import { ProductEntity } from "@/domain/entities/products";
import { IProductRepository } from "@/domain/repositories";

export class GetProductDetailsUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(id: string): Promise<ProductEntity | null> {
        return this.productRepository.findById(id);
    }
}