import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/main/app.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ResponseFormatInterceptor } from '@/common/interceptors/response-format.interceptor';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let createdProductId1: string;
  let createdProductId2: string;

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

    // Criar produtos para usar nos testes de pedidos
    const product1 = await request(app.getHttpServer())
      .post('/api/products')
      .send({
        name: 'Produto 1 E2E',
        category: 'Categoria 1',
        description: 'Descrição 1',
        price: 100.00,
        quantity: 20,
      });
    createdProductId1 = product1.body.data.id;

    const product2 = await request(app.getHttpServer())
      .post('/api/products')
      .send({
        name: 'Produto 2 E2E',
        category: 'Categoria 2',
        description: 'Descrição 2',
        price: 50.00,
        quantity: 15,
      });
    createdProductId2 = product2.body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/orders - Criar Pedido', () => {
    describe('Casos de Sucesso', () => {
      it('deve criar um pedido com sucesso', async () => {
        const createOrderDto = {
          cart: [
            {
              product_id: createdProductId1,
              quantity: 2,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(201);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('cart');
        expect(response.body.data).toHaveProperty('total_value');
        expect(response.body.data).toHaveProperty('status');
        expect(response.body.data.cart).toHaveLength(1);
        expect(response.body.data.total_value).toBe(200.00); // 100 * 2
        expect(response.body.data.status).toBe('Pending');
      });

      it('deve criar um pedido com múltiplos produtos', async () => {
        const createOrderDto = {
          cart: [
            {
              product_id: createdProductId1,
              quantity: 1,
            },
            {
              product_id: createdProductId2,
              quantity: 2,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(201);

        expect(response.body.data.cart).toHaveLength(2);
        expect(response.body.data.total_value).toBe(200.00); // (100 * 1) + (50 * 2)
      });

      it('deve reduzir o estoque dos produtos após criar o pedido', async () => {
        // Buscar produto na listagem para verificar estoque inicial
        const productsList = await request(app.getHttpServer())
          .get('/api/products')
          .expect(200);

        const productBefore = productsList.body.data.data.find(
          (p: any) => p.id === createdProductId1
        );
        const initialQuantity = productBefore?.quantity || 0;

        // Criar pedido
        const createOrderDto = {
          cart: [
            {
              product_id: createdProductId1,
              quantity: 3,
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(201);

        // Verificar estoque após o pedido
        const productsListAfter = await request(app.getHttpServer())
          .get('/api/products')
          .expect(200);

        const productAfter = productsListAfter.body.data.data.find(
          (p: any) => p.id === createdProductId1
        );

        expect(productAfter?.quantity).toBe(initialQuantity - 3);
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar erro 404 quando produto não existir', async () => {
        const createOrderDto = {
          cart: [
            {
              product_id: '999999',
              quantity: 1,
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(404);

        expect(response.body).toHaveProperty('statusCode', 404);
        expect(response.body.message).toContain('Product not found');
      });

      it('deve retornar erro 400 quando estoque for insuficiente', async () => {
        const createOrderDto = {
          cart: [
            {
              product_id: createdProductId1,
              quantity: 1000, // Mais do que o estoque disponível
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(400);

        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body.message).toContain('Insufficient stock');
      });

      it('deve retornar erro 400 quando carrinho estiver vazio', async () => {
        const createOrderDto = {
          cart: [],
        };

        await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando quantidade for menor que 1', async () => {
        const createOrderDto = {
          cart: [
            {
              product_id: createdProductId1,
              quantity: 0,
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando product_id estiver vazio', async () => {
        const createOrderDto = {
          cart: [
            {
              product_id: '',
              quantity: 1,
            },
          ],
        };

        await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(400);
      });

      it('deve retornar erro 400 quando carrinho não for um array', async () => {
        const createOrderDto = {
          cart: 'not-an-array',
        };

        await request(app.getHttpServer())
          .post('/api/orders')
          .send(createOrderDto)
          .expect(400);
      });
    });
  });

  describe('GET /api/orders - Listar Pedidos', () => {
    describe('Casos de Sucesso', () => {
      it('deve listar pedidos com paginação padrão', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/orders')
          .expect(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('page');
        expect(response.body.data).toHaveProperty('items');
        expect(response.body.data).toHaveProperty('total');
        expect(response.body.data).toHaveProperty('pages');
        expect(Array.isArray(response.body.data.data)).toBe(true);
      });

      it('deve listar pedidos com paginação customizada', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/orders?page=1&limit=5')
          .expect(200);

        expect(response.body.data.page).toBe(1);
        expect(response.body.data.data.length).toBeLessThanOrEqual(5);
      });

      it('deve retornar lista vazia quando não houver pedidos na página', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/orders?page=999')
          .expect(200);

        expect(response.body.data).toHaveProperty('data');
        expect(Array.isArray(response.body.data.data)).toBe(true);
      });
    });

    describe('Casos de Erro', () => {
      it('deve retornar erro 400 quando página for inválida', async () => {
        await request(app.getHttpServer())
          .get('/api/orders?page=0')
          .expect(400);
      });

      it('deve retornar erro 400 quando limit for inválido', async () => {
        await request(app.getHttpServer())
          .get('/api/orders?limit=0')
          .expect(400);
      });

      it('deve retornar erro 400 quando limit exceder o máximo', async () => {
        await request(app.getHttpServer())
          .get('/api/orders?limit=101')
          .expect(400);
      });
    });
  });
});
