import { IDatabaseClient } from '@/common/contracts/database-client.contract';
import { DatabaseConfig } from './database.config';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Implementação concreta do cliente de database para json-server
 * 
 * Esta classe encapsula toda a lógica específica do json-server,
 * permitindo que o repositório seja agnóstico sobre qual banco está sendo usado.
 */
export class JsonServerClient implements IDatabaseClient {

    async ensureConnection(timeout: number = 5000): Promise<boolean> {
        return DatabaseConfig.ensureConnection(timeout);
    }

    /**
     * Método auxiliar para construir URL com query parameters
     */
    private buildUrlWithParams(url: string, queryParams?: Record<string, string>): string {
        if (!queryParams || Object.keys(queryParams).length === 0) {
            return url;
        }

        const searchParams = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
    }

    async get<T>(url: string, queryParams?: Record<string, string>, headers: Record<string, string> = {}): Promise<T> {
        try {
            const finalUrl = this.buildUrlWithParams(url, queryParams);

            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new HttpException(
                    {
                        message: `GET request failed: ${errorText}`,
                        statusCode: response.status,
                        error: 'Request Failed',
                    },
                    response.status >= 500 ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST,
                );
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: `Network error during GET request: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    /**
     * Método auxiliar para fazer GET e retornar dados com headers (útil para paginação)
     */
    async getWithHeaders<T>(url: string, queryParams?: Record<string, string>, headers: Record<string, string> = {}): Promise<T> {
        try {
            const finalUrl = this.buildUrlWithParams(url, queryParams);

            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new HttpException(
                    {
                        message: `GET request failed: ${errorText}`,
                        statusCode: response.status,
                        error: 'Request Failed',
                    },
                    response.status >= 500 ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST,
                );
            }

            const data = await response.json() as T;
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: `Network error during GET request: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async post<T>(url: string, data: any, headers: Record<string, string> = {}): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new HttpException(
                    {
                        message: `POST request failed: ${errorText}`,
                        statusCode: response.status,
                        error: 'Request Failed',
                    },
                    response.status >= 500 ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST,
                );
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: `Network error during POST request: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async put<T>(url: string, data: any, headers: Record<string, string> = {}): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new HttpException(
                    {
                        message: `PUT request failed: ${errorText}`,
                        statusCode: response.status,
                        error: 'Request Failed',
                    },
                    response.status >= 500 ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST,
                );
            }

            return await response.json() as T;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: `Network error during PUT request: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }

    async delete<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => response.statusText);
                throw new HttpException(
                    {
                        message: `DELETE request failed: ${errorText}`,
                        statusCode: response.status,
                        error: 'Request Failed',
                    },
                    response.status >= 500 ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST,
                );
            }

            // DELETE pode retornar vazio, então tentamos parsear ou retornamos vazio
            const text = await response.text();
            return (text ? JSON.parse(text) : {}) as T;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    message: `Network error during DELETE request: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                    error: 'Service Unavailable',
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}
