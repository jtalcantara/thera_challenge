/**
 * DTO para requisição de exclusão de produto (Request)
 */
export class DeleteProductRequestDTO {
    id!: string;
}


/**
 * DTO para resposta de exclusão de produto (Response)
 */
export class DeleteProductResponseDTO {
    success!: boolean;
}
