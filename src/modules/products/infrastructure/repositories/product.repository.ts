import { IProductRepository } from '@/modules/products/domain/repositories/product.repository';
import { CreateProductRequestDTO, CreateProductResponseDTO, ProductDTO, ListProductsRequestDTO, ListProductsResponseDTO, UpdateProductResponseDTO, UpdateProductRequestDTO, DeleteProductResponseDTO } from '@/modules/products/domain/dtos';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '@/modules/products/infrastructure/database/product.entity';

export class ProductRepository implements IProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {}

    /**
     * Converte ProductEntity para ProductDTO
     */
    private entityToDTO(entity: ProductEntity): ProductDTO {
        return {
            id: entity.id,
            name: entity.name,
            category: entity.category,
            description: entity.description,
            price: Number(entity.price),
            quantity: entity.quantity,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    async findById(id: string): Promise<ProductDTO | null> {
        const product = await this.productRepository.findOne({ where: { id } });
        return product ? this.entityToDTO(product) : null;
    }

    async findByName(name: string): Promise<ProductDTO | null> {
        const product = await this.productRepository.findOne({ where: { name } });
        return product ? this.entityToDTO(product) : null;
    }

    async create(data: CreateProductRequestDTO): Promise<CreateProductResponseDTO> {
        const existingProduct = await this.findByName(data.name);

        if (existingProduct) {
            throw new HttpException(
                {
                    message: `Product already exists: ${data.name}`,
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const productEntity = this.productRepository.create({
            name: data.name,
            category: data.category,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
        });

        await this.productRepository.save(productEntity);

        const productDTO = this.entityToDTO(productEntity);
        return new CreateProductResponseDTO(productDTO);
    }

    async list(data: ListProductsRequestDTO): Promise<ListProductsResponseDTO> {
        const { page = 1, limit = 10 } = data;
        const skip = (page - 1) * limit;

        const [products, total] = await this.productRepository.findAndCount({
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });

        const totalPages = Math.ceil(total / limit);
        const productDTOs = products.map((product: ProductEntity) => this.entityToDTO(product));

        return new ListProductsResponseDTO(
            productDTOs,
            productDTOs.length,
            page,
            total,
            totalPages,
        );
    }

    async update(id: string, data: UpdateProductRequestDTO): Promise<UpdateProductResponseDTO> {
        const existingProduct = await this.productRepository.findOne({ where: { id } });

        if (!existingProduct) {
            throw new HttpException(
                {
                    message: `Product not found: ${id}`,
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        // Atualiza apenas os campos fornecidos
        if (data.name !== undefined) existingProduct.name = data.name;
        if (data.category !== undefined) existingProduct.category = data.category;
        if (data.description !== undefined) existingProduct.description = data.description;
        if (data.price !== undefined) existingProduct.price = data.price;
        if (data.quantity !== undefined) existingProduct.quantity = data.quantity;

        await this.productRepository.save(existingProduct);

        const updatedDTO = this.entityToDTO(existingProduct);
        return new UpdateProductResponseDTO(updatedDTO);
    }

    async delete(id: string): Promise<DeleteProductResponseDTO> {
        const existingProduct = await this.productRepository.findOne({ where: { id } });

        if (!existingProduct) {
            throw new HttpException(
                {
                    message: `Product not found: ${id}`,
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                },
                HttpStatus.NOT_FOUND,
            );
        }

        await this.productRepository.remove(existingProduct);

        const deleteResponse = new DeleteProductResponseDTO();
        deleteResponse.success = true;
        return deleteResponse;
    }
}
