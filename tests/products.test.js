import request from 'supertest';
import app from '../server.js';
import Product from '../models/Dealership.js';

describe('Product GET Routes', () => {
  beforeAll(async () => {
    // Create test products
    await Product.create([
      {
        name: 'Laptop',
        description: 'High-performance laptop',
        category: 'Electronics',
        price: 999.99,
        stock: 50
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton shirt',
        category: 'Clothing',
        price: 29.99,
        stock: 100
      }
    ]);
  });

  afterAll(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    test('should get all products with success status', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return correct number of products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.body.count).toBe(2);
    });

    test('should include product fields', async () => {
      const response = await request(app).get('/api/products');
      const product = response.body.data[0];
      expect(product.name).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.stock).toBeDefined();
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeAll(async () => {
      const product = await Product.findOne({ name: 'Laptop' });
      productId = product._id.toString();
    });

    test('should get product by valid ID', async () => {
      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Laptop');
    });

    test('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app).get(`/api/products/${fakeId}`);
      expect(response.status).toBe(404);
    });

    test('should return correct product data', async () => {
      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.body.data.price).toBe(999.99);
      expect(response.body.data.stock).toBe(50);
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/products/invalidid');
      expect(response.status).toBe(400);
    });
  });
});
