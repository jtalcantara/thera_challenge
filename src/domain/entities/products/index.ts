export type ProductProps = {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
};

export class ProductEntity implements ProductProps {
    public id: string;
    public name: string;
    public category: string;
    public description: string;
    public price: number;
    public quantity: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor({
        id,
        name,
        category,
        description,
        price,
        quantity,
        createdAt,
        updatedAt,
    }: ProductProps) {

        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.validate();
    }

    /**
     * Valida as propriedades do produto
     * Nem todos os campos são obrigatórios, mas alguns são.
     * - Nome é obrigatório
     * - Preço é obrigatório
     * - Quantidade é obrigatório
     * - Categoria é obrigatório
     * @throws {Error} Se alguma propriedade for inválida
     */
    validate(): void {
        if (!this.name) {
            throw new Error('Name is required');
        }

        if (!this.price) {
            throw new Error('Price is required');
        }

        if (!this.quantity) {
            throw new Error('Quantity is required');
        }

        if (!this.category) {
            throw new Error('Category is required');
        }
    }
}