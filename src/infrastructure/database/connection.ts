/**
 * Configuração e utilitários para conexão com json-server
 * 
 * Esta é uma implementação concreta de acesso ao banco de dados,
 * por isso está na camada de Infrastructure seguindo Clean Architecture.
 */

export const DB_CONFIG = {
  host: 'http://localhost',
  port: 3001,
  baseUrl: 'http://localhost:3001',
  endpoints: {
    products: '/api/products',
    orders: '/api/orders',
  },
} as const;

/**
 * Retorna a URL completa para um endpoint
 */
export function getEndpoint(resource: keyof typeof DB_CONFIG.endpoints): string {
  return `${DB_CONFIG.baseUrl}${DB_CONFIG.endpoints[resource]}`;
}

/**
 * Retorna a URL completa para um recurso específico por ID
 */
export function getResourceUrl(
  resource: keyof typeof DB_CONFIG.endpoints,
  id: string
): string {
  return `${getEndpoint(resource)}/${id}`;
}
