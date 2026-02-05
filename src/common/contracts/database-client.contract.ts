/**
 * Interface abstrata para clientes de banco de dados
 * 
 * Esta interface permite que o repositório seja desacoplado da implementação
 * específica do banco de dados, seguindo o princípio de Inversão de Dependência (SOLID).
 * 
 * Para trocar de banco de dados, basta criar uma nova implementação desta interface
 * e atualizar o módulo para usar a nova implementação.
 */
export interface IDatabaseClient {
    /**
     * Verifica se a conexão com o banco de dados está disponível
     * @param timeout - Tempo limite em milissegundos
     * @returns Promise<boolean> - true se a conexão está disponível
     */
    ensureConnection(timeout?: number): Promise<boolean>;

    /**
     * Realiza uma requisição GET
     * @param url - URL completa do endpoint
     * @param queryParams - Parâmetros de query opcionais
     * @param headers - Headers HTTP opcionais
     * @returns Promise com os dados retornados
     */
    get<T>(url: string, queryParams?: Record<string, string>, headers?: Record<string, string>): Promise<T>;

    /**
     * Realiza uma requisição GET e retorna dados com headers (útil para paginação)
     * @param url - URL completa do endpoint
     * @param queryParams - Parâmetros de query opcionais
     * @param headers - Headers HTTP opcionais
     * @returns Promise com os dados e headers da resposta
     */
    getWithHeaders<T>(url: string, queryParams?: Record<string, string>, headers?: Record<string, string>): Promise<{ data: T; responseHeaders: Headers }>;

    /**
     * Realiza uma requisição POST
     * @param url - URL completa do endpoint
     * @param data - Dados a serem enviados
     * @param headers - Headers HTTP opcionais
     * @returns Promise com a resposta
     */
    post<T>(url: string, data: any, headers?: Record<string, string>): Promise<T>;

    /**
     * Realiza uma requisição PUT
     * @param url - URL completa do endpoint
     * @param data - Dados a serem enviados
     * @param headers - Headers HTTP opcionais
     * @returns Promise com a resposta
     */
    put<T>(url: string, data: any, headers?: Record<string, string>): Promise<T>;

    /**
     * Realiza uma requisição DELETE
     * @param url - URL completa do endpoint
     * @param headers - Headers HTTP opcionais
     * @returns Promise com a resposta
     */
    delete<T>(url: string, headers?: Record<string, string>): Promise<T>;
}
