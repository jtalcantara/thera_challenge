import { ProductDTO } from "@/modules/products/domain/dtos/base.dto";

/**
 * DTO para criação de produto (Request)
 */
export class CreateProductRequestDTO extends ProductDTO {
    constructor(props: Omit<ProductDTO, 'id' | 'createdAt' | 'updatedAt'>) {
        super();
        Object.assign(this, props);
    }
}

/**
 * DTO para resposta de criação de produto (Response)
 * O retono é vazio de propósito para evitar retornar dados que não são necessários na mesma requisição
 */
export class CreateProductResponseDTO {
}
