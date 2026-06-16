import request from 'supertest';
import app from '../server.js';
import Order from '../models/Vehicle.js';
import User from '../models/User.js';
import Product from '../models/Dealership.js';

describe('Order GET Routes', () => {
  let userId, productId;

  beforeAll(async () => {
    // Create test user
    const user = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+1-987-654-3210',
      address: '456 Oak Ave'
    });
    userId = user._id.toString();

    // Create test product
    const product = await Product.create({
      name: 'Mouse',
      description: 'Wireless mouse',
      category: 'Electronics',
      price: 29.99,
      stock: 200
    });
    productId = product._id.toString();

    // Create test order
    await Order.create({
      userId,
      products: [
        {
          productId,
          quantity: 2,
          price: 29.99
        }
      ],
      totalAmount: 59.98,
      paymentMethod: 'credit_card',
      shippingAddress: '789 Pine St'
    });
  });

  afterAll(async () => {
    await Order.deleteMany({});
    await User.deleteMany({ email: 'jane@example.com' });
    await Product.deleteMany({ name: 'Mouse' });
  });

  describe('GET /api/orders', () => {
    test('should get all orders with success status', async () => {
      const response = await request(app).get('/api/orders');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return orders with populated references', async () => {
      const response = await request(app).get('/api/orders');
      if (response.body.data.length > 0) {
        const order = response.body.data[0];
        expect(order._id).toBeDefined();
        expect(order.userId).toBeDefined();
        expect(order.products).toBeDefined();
      }
    });

    test('should include order status field', async () => {
      const response = await request(app).get('/api/orders');
      if (response.body.data.length > 0) {
        const order = response.body.data[0];
        expect(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).toContain(order.status);
      }
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeAll(async () => {
      const order = await Order.findOne({ totalAmount: 59.98 });
      orderId = order._id.toString();
    });

    test('should get order by valid ID', async () => {
      const response = await request(app).get(`/api/orders/${orderId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should return populated order data', async () => {
      const response = await request(app).get(`/api/orders/${orderId}`);
      expect(response.body.data.totalAmount).toBe(59.98);
      expect(response.body.data.products).toBeDefined();
    });

    test('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app).get(`/api/orders/${fakeId}`);
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/orders/invalidid');
      expect(response.status).toBe(400);
    });
  });
});
