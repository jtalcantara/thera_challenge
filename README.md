# Thera Challenge

## Sobre a Aplicação

API RESTful desenvolvida em NestJS para gerenciamento de pedidos e produtos. A aplicação permite criar, listar, atualizar e deletar produtos, além de criar e listar pedidos com controle de estoque automático.

### Funcionalidades

**Produtos:**
- Criar, listar, atualizar e deletar produtos
- Campos: `id`, `nome`, `categoria`, `descrição`, `preço`, `quantidade_estoque`
- Validação de duplicidade por nome

**Pedidos:**
- Criar e listar pedidos
- Verificação automática de estoque disponível
- Atualização de estoque ao concluir pedidos
- Campos: `id`, `cart` (lista de produtos com quantidades), `total_pedido`, `status`

### Tecnologias

- **Framework:** NestJS (Node.js)
- **ORM:** TypeORM
- **Banco de Dados:** MySQL
- **Validação:** class-validator
- **Testes:** Jest
- **Arquitetura:** Clean Architecture com princípios SOLID

## Pré-requisitos

- Node.js LTS (versão 24.x ou superior)
- npm
- MySQL (versão 8.0 ou superior)

## Instalação

```bash
npm install
```

## Scripts Disponíveis

- `npm run build` - Compila o projeto TypeScript para JavaScript usando NestJS CLI
- `npm run start:dev` - Executa o projeto em modo desenvolvimento com hot-reload (NestJS)
- `npm start` - Executa o projeto compilado
- `npm run start:prod` - Executa o projeto em modo produção
- `npm test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:coverage` - Executa os testes e gera relatório de cobertura

## Estrutura do Projeto

```
thera_challenge/
├── src/
│   ├── modules/                    # Módulos da aplicação
│   │   ├── products/               # Módulo de produtos
│   │   │   ├── controllers/       # Controladores REST
│   │   │   ├── services/          # Lógica de negócio
│   │   │   ├── domain/            # Camada de domínio
│   │   │   │   ├── dtos/          # Data Transfer Objects
│   │   │   │   └── repositories/  # Contratos de repositórios
│   │   │   └── infrastructure/    # Implementações
│   │   │       └── repositories/  # Repositórios concretos
│   │   └── orders/                # Módulo de pedidos
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── domain/
│   │       └── infrastructure/
│   ├── common/                     # Código compartilhado
│   │   ├── contracts/             # Contratos e interfaces
│   │   ├── filters/               # Filtros de exceção
│   │   ├── interceptors/          # Interceptadores
│   │   └── middlewares/           # Middlewares (logging)
│   ├── infrastructure/            # Infraestrutura
│   │   └── database/              # Configuração do TypeORM e MySQL
│   ├── docs/                      # Documentação (Postman)
│   └── main/                      # Configuração principal
│       ├── app.module.ts          # Módulo raiz
│       └── main.ts                # Ponto de entrada
├── dist/                          # Código compilado
├── coverage/                      # Relatório de testes
├── package.json
├── tsconfig.json
├── nest-cli.json
└── jest.config.ts
```

## Desenvolvimento

### Configuração do Banco de Dados MySQL

1. Configure as variáveis de ambiente do banco de dados (crie um arquivo `.env`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
```

2. Certifique-se de que o MySQL está rodando e o banco de dados foi criado.

3. Inicie a aplicação NestJS:
```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000/api`.

## Build

Para compilar o projeto:

```bash
npm run build
```

O código compilado estará na pasta `dist/`.

## Testes

O projeto utiliza Jest para testes. Para executar os testes:

```bash
npm test
```

Para executar os testes em modo watch (re-executa quando há mudanças):

```bash
npm run test:watch
```

Para gerar relatório de cobertura:

```bash
npm run test:coverage
```

Os arquivos de teste devem seguir o padrão `*.test.ts` ou `*.spec.ts` e estar na pasta `src/`.
