/**
 * Configuração do banco de dados (json-server)
 * 
 * Centraliza a configuração da conexão com o json-server,
 * permitindo fácil alteração da URL base e porta
 */
export class DatabaseConfig {
    private static readonly DEFAULT_HOST = process.env.DB_HOST || 'localhost';
    private static readonly DEFAULT_PORT = process.env.DB_PORT || '3001';
    private static readonly DEFAULT_BASE_URL = `http://${DatabaseConfig.DEFAULT_HOST}:${DatabaseConfig.DEFAULT_PORT}`;

    /**
     * Retorna a URL base do json-server
     */
    static getBaseUrl(): string {
        return DatabaseConfig.DEFAULT_BASE_URL;
    }

    /**
     * Constrói a URL completa para um endpoint específico
     * @param resource - Nome do recurso (ex: 'products', 'orders')
     * @returns URL completa do endpoint
     */
    static getEndpoint(resource: string): string {
        return `${DatabaseConfig.DEFAULT_BASE_URL}/${resource}`;
    }

    /**
     * Verifica se o json-server está disponível
     * Faz uma requisição HEAD para verificar a conectividade
     * @param timeout - Tempo limite em milissegundos (padrão: 5000ms)
     * @returns Promise<boolean> - true se o servidor está disponível
     */
    static async ensureConnection(timeout: number = 5000): Promise<boolean> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(DatabaseConfig.DEFAULT_BASE_URL, {
                method: 'HEAD',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            return response.ok || response.status === 404; // 404 é OK, significa que o servidor está rodando
        } catch (error) {
            // Timeout, conexão recusada, ou outro erro de rede
            return false;
        }
    }
}
