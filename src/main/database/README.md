# Database - JSON Server

Estrutura de dados usando json-server para simular uma API REST.

## Estrutura

```
database/
├── db.json              # Arquivo principal com os dados
├── routes.json          # Configuração de rotas customizadas
├── middleware.js        # Middleware para logs
├── connection.ts        # Configuração de conexão
├── seeds/
│   ├── produtos.seed.json   # Dados iniciais de produtos
│   └── reset-db.ts          # Script para resetar o banco
└── README.md
```

## Scripts Disponíveis

### Iniciar o servidor JSON
```bash
npm run db:server
```
Inicia o json-server na porta 3001 com:
- Rotas customizadas (`/api/produtos`, `/api/pedidos`)
- Middleware de logs
- Watch mode (atualiza automaticamente)

### Resetar banco de dados
```bash
npm run db:reset
```
Reseta o `db.json` com os dados iniciais do seed.

## Endpoints Disponíveis

### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `GET /api/produtos/:id` - Busca produto por ID
- `POST /api/produtos` - Cria novo produto
- `PUT /api/produtos/:id` - Atualiza produto
- `PATCH /api/produtos/:id` - Atualiza parcialmente
- `DELETE /api/produtos/:id` - Remove produto

### Pedidos
- `GET /api/pedidos` - Lista todos os pedidos
- `GET /api/pedidos/:id` - Busca pedido por ID
- `POST /api/pedidos` - Cria novo pedido
- `PUT /api/pedidos/:id` - Atualiza pedido
- `PATCH /api/pedidos/:id` - Atualiza parcialmente
- `DELETE /api/pedidos/:id` - Remove pedido

### Pedido Itens
- `GET /api/pedidos/:id/itens` - Lista itens de um pedido

## Estrutura de Dados

### Produto
```json
{
  "id": "string",
  "nome": "string",
  "categoria": "string",
  "descricao": "string",
  "preco": "number",
  "quantidade_estoque": "number"
}
```

### Pedido
```json
{
  "id": "string",
  "status": "Pendente" | "Concluído" | "Cancelado",
  "total_pedido": "number",
  "created_at": "string (ISO date)"
}
```

### Pedido Item
```json
{
  "id": "string",
  "pedido_id": "string",
  "produto_id": "string",
  "quantidade": "number",
  "preco_unitario": "number"
}
```

## Uso no Código

```typescript
import { getEndpoint, DB_CONFIG } from '@/database/connection.js';

// Obter URL do endpoint
const produtosUrl = getEndpoint('produtos'); 
// Retorna: http://localhost:3001/api/produtos

// Fazer requisição
const response = await fetch(produtosUrl);
const produtos = await response.json();
```

## Desenvolvimento

1. Inicie o servidor:
   ```bash
   npm run db:server
   ```

2. O servidor estará disponível em `http://localhost:3001`

3. Para resetar os dados:
   ```bash
   npm run db:reset
   ```

## Notas

- O json-server persiste automaticamente as mudanças no `db.json`
- Use o modo watch para desenvolvimento
- Para testes, você pode usar um banco em memória ou mockar as requisições
