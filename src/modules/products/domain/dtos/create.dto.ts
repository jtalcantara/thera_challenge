import { ProductDTO } from "@/modules/products/domain/dtos/base.dto";

/**
 * DTO para criação de produto (Request)
 */
export type CreateProductRequestDTO = Omit<ProductDTO, 'id' | 'createdAt' | 'updatedAt'>

/**
 * DTO para resposta de criação de produto (Response)
 */
export type CreateProductResponseDTO = boolean
