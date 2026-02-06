import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/main/app.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalInterceptors(new ResponseFormatInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/products - Criar Produto', () => {
    describe('Casos de Sucesso', () => {
      it('deve criar um produto com sucesso', async () => {
        const createProductDto = {
          name: 'Produto E2E Test',
          category: 'Categoria E2E',
          description: 'Descrição do produto E2E',
          price: 99.99,
          quantity: 10,
        };

        const response = await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(201);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(createProductDto.name);
        expect(response.body.data.category).toBe(createProductDto.category);
        expect(response.body.data.price).toBe(createProductDto.price);
        expect(response.body.data.quantity).toBe(createProductDto.quantity);
      });

      it('deve criar um produto sem descrição (opcional)', async () => {
        const createProductDto = {
          name: 'Produto Sem Descrição E2E',
          category: 'Categoria E2E',
          price: 50.00,
          quantity: 5,
        };

        const response = await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(201);

        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(createProductDto.name);
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar erro 400 quando nome for muito curto', async () => {
        const createProductDto = {
          name: 'AB', // Menos de 3 caracteres
          category: 'Categoria',
          price: 99.99,
          quantity: 10,
        };

        const response = await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(400);

        expect(response.body).toHaveProperty('statusCode', 400);
      });

      it('deve retornar erro 400 quando nome estiver vazio', async () => {
        const createProductDto = {
          name: '',
          category: 'Categoria',
          price: 99.99,
          quantity: 10,
        };

        await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando preço for negativo', async () => {
        const createProductDto = {
          name: 'Produto Teste',
          category: 'Categoria',
          price: -10,
          quantity: 10,
        };

        await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando quantidade for negativa', async () => {
        const createProductDto = {
          name: 'Produto Teste',
          category: 'Categoria',
          price: 99.99,
          quantity: -5,
        };

        await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando campos obrigatórios estiverem faltando', async () => {
        const createProductDto = {
          name: 'Produto Teste',
          // category faltando
          price: 99.99,
          quantity: 10,
        };

        await request(app.getHttpServer())
          .post('/api/products')
          .send(createProductDto)
          .expect(400);
      });
    });
  });

  describe('GET /api/products - Listar Produtos', () => {
    describe('Casos de Sucesso', () => {
      it('deve listar produtos com paginação padrão', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/products')
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('page');
        expect(response.body.data).toHaveProperty('items');
        expect(response.body.data).toHaveProperty('total');
        expect(response.body.data).toHaveProperty('pages');
        expect(Array.isArray(response.body.data.data)).toBe(true);
      });

      it('deve listar produtos com paginação customizada', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/products?page=1&limit=5')
          .expect(200);

        expect(response.body.data.page).toBe(1);
        expect(response.body.data.data.length).toBeLessThanOrEqual(5);
      });

      it('deve retornar lista vazia quando não houver produtos', async () => {
        // Este teste pode variar dependendo do estado do banco
        const response = await request(app.getHttpServer())
          .get('/api/products?page=999')
          .expect(200);

        expect(response.body.data).toHaveProperty('data');
        expect(Array.isArray(response.body.data.data)).toBe(true);
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar erro 400 quando página for inválida', async () => {
        await request(app.getHttpServer())
          .get('/api/products?page=0')
          .expect(400);
      });

      it('deve retornar erro 400 quando limit for inválido', async () => {
        await request(app.getHttpServer())
          .get('/api/products?limit=0')
          .expect(400);
      });

      it('deve retornar erro 400 quando limit exceder o máximo', async () => {
        await request(app.getHttpServer())
          .get('/api/products?limit=101')
          .expect(400);
      });
    });
  });

  describe('PATCH /api/products/:id - Atualizar Produto', () => {
    let createdProductId: string;

    beforeAll(async () => {
      // Criar um produto para usar nos testes de atualização
      const createProductDto = {
        name: 'Produto Para Atualizar',
        category: 'Categoria',
        description: 'Descrição',
        price: 100.00,
        quantity: 10,
      };

      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send(createProductDto);

      createdProductId = response.body.data.id;
    });

    describe('Casos de Sucesso', () => {
      it('deve atualizar um produto com sucesso', async () => {
        const updateProductDto = {
          name: 'Produto Atualizado E2E',
          price: 150.00,
        };

        const response = await request(app.getHttpServer())
          .patch(`/api/products/${createdProductId}`)
          .send(updateProductDto)
          .expect(200);

        expect(response.body.data.name).toBe(updateProductDto.name);
        expect(response.body.data.price).toBe(updateProductDto.price);
      });

      it('deve atualizar apenas o preço do produto', async () => {
        const updateProductDto = {
          price: 200.00,
        };

        const response = await request(app.getHttpServer())
          .patch(`/api/products/${createdProductId}`)
          .send(updateProductDto)
          .expect(200);

        expect(response.body.data.price).toBe(200.00);
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar erro 404 quando produto não existir', async () => {
        const updateProductDto = {
          name: 'Produto Inexistente',
        };

        await request(app.getHttpServer())
          .patch('/api/products/999999')
          .send(updateProductDto)
          .expect(404);
      });

      it('deve retornar erro 400 quando preço for negativo', async () => {
        const updateProductDto = {
          price: -10,
        };

        await request(app.getHttpServer())
          .patch(`/api/products/${createdProductId}`)
          .send(updateProductDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando nome for muito curto', async () => {
        const updateProductDto = {
          name: 'AB',
        };

        await request(app.getHttpServer())
          .patch(`/api/products/${createdProductId}`)
          .send(updateProductDto)
          .expect(400);
      });
    });
  });

  describe('DELETE /api/products/:id - Deletar Produto', () => {
    let createdProductId: string;

    beforeEach(async () => {
      // Criar um produto para cada teste de deleção
      const createProductDto = {
        name: 'Produto Para Deletar',
        category: 'Categoria',
        description: 'Descrição',
        price: 100.00,
        quantity: 10,
      };

      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send(createProductDto);

      createdProductId = response.body.data.id;
    });

    describe('Casos de Sucesso', () => {
      it('deve deletar um produto com sucesso', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/api/products/${createdProductId}`)
          .expect(200);

        expect(response.body.data).toHaveProperty('success', true);
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar erro 404 quando produto não existir', async () => {
        await request(app.getHttpServer())
          .delete('/api/products/999999')
          .expect(404);
      });
    });
  });
});
