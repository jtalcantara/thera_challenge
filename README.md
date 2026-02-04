# Thera Challenge

## Objetivo

Desenvolver uma API RESTful para gerenciamento de pedidos e produtos, com foco em boas práticas (SOLID), organização de código em classes, e manipulação de banco de dados.

## Descrição do Desafio

Você deve criar uma API para um sistema de gerenciamento de pedidos e produtos.

## Funcionalidades Obrigatórias

### 1. Produtos

- Criar, listar, editar e deletar produtos.
- Cada produto deve conter os seguintes campos:
  - `id` (autogerado)
  - `nome`
  - `categoria`
  - `descrição`
  - `preço`
  - `quantidade_estoque`

### 2. Pedidos

- Criar e listar pedidos.
- Cada pedido deve conter os seguintes campos:
  - `id` (autogerado)
  - `produtos` (lista de produtos no pedido, incluindo quantidade de cada um)
  - `total_pedido` (valor total do pedido)
  - `status` ("Pendente", "Concluído" ou "Cancelado")
- Ao criar um pedido:
  - Verificar se a quantidade de cada produto está disponível no estoque.
  - Atualizar o estoque caso o pedido seja concluído.

## Requisitos Técnicos

- ✅ Usar Node.js com NestJS.
- ✅ Organizar o código seguindo boas práticas:
  - Separar em camadas (controller, service, repository).
  - Aplicar princípios do SOLID.
- ✅ Utilizar banco de dados relacional ou não relacional (json-server).
- ✅ Implementar pelo menos um middleware (log de requisições).
- Escrever pelo menos:
  - 2 testes unitários.

## Extras (Diferenciais)

- Documentar a API com Swagger ou Postman.
- Adicionar autenticação simples com JWT.
- Implementar Docker para subir o ambiente.

## Pré-requisitos

- Node.js LTS (versão 24.x ou superior)
- npm

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
- `npm run db:server` - Inicia o json-server na porta 3001
- `npm run db:reset` - Reseta o banco de dados com dados iniciais

## Estrutura do Projeto

```
thera_challenge/
├── src/
│   ├── products/          # Módulo de produtos (NestJS)
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   ├── domain/            # Camada de domínio (SOLID)
│   │   ├── entities/     # Entidades de domínio
│   │   ├── repositories/ # Contratos de repositórios
│   │   └── usecases/     # Casos de uso
│   ├── infrastructure/    # Camada de infraestrutura
│   │   └── repositories/ # Implementações concretas
│   ├── common/           # Código compartilhado
│   │   └── middleware/   # Middlewares
│   ├── app.module.ts     # Módulo raiz do NestJS
│   └── main.ts           # Ponto de entrada da aplicação
├── dist/                 # Código compilado (gerado automaticamente)
├── coverage/             # Relatório de cobertura de testes
├── package.json
├── tsconfig.json
├── nest-cli.json         # Configuração do NestJS CLI
├── jest.config.ts
└── README.md
```

## Desenvolvimento

Para iniciar o desenvolvimento:

1. Primeiro, inicie o json-server em um terminal:
```bash
npm run db:server
```

2. Em outro terminal, inicie a aplicação NestJS:
```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000/api` e o json-server em `http://localhost:3001`.

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
