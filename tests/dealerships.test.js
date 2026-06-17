import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Dealership from '../models/Dealership.js';

describe('Dealerships GET Routes', () => {
  beforeAll(async () => {
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Dealership.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean database before each test
    await Dealership.deleteMany({});
  });

  describe('GET /api/dealerships', () => {
    test('should return all dealerships with success true', async () => {
      // Create test dealerships
      await Dealership.create({
        name: 'Downtown Motors',
        location: '123 Main St, New York, NY',
        phone: '555-0123',
        email: 'downtown@example.com',
      });

      await Dealership.create({
        name: 'Uptown Auto',
        location: '456 Oak Ave, Boston, MA',
        phone: '555-0124',
        email: 'uptown@example.com',
      });

      const response = await request(app).get('/api/dealerships');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test('should return empty array when no dealerships exist', async () => {
      const response = await request(app).get('/api/dealerships');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('should include dealership properties in response', async () => {
      await Dealership.create({
        name: 'Downtown Motors',
        location: '123 Main St, New York, NY',
        phone: '555-0123',
        email: 'downtown@example.com',
      });

      const response = await request(app).get('/api/dealerships');

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('location');
      expect(response.body.data[0]).toHaveProperty('phone');
      expect(response.body.data[0]).toHaveProperty('email');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      expect(response.body.data[0]).toHaveProperty('updatedAt');
    });

    test('should verify dealership data accuracy', async () => {
      await Dealership.create({
        name: 'Downtown Motors',
        location: '123 Main St, New York, NY',
        phone: '555-0123',
        email: 'downtown@example.com',
      });

      const response = await request(app).get('/api/dealerships');

      expect(response.body.data[0].name).toBe('Downtown Motors');
      expect(response.body.data[0].location).toBe('123 Main St, New York, NY');
      expect(response.body.data[0].phone).toBe('555-0123');
      expect(response.body.data[0].email).toBe('downtown@example.com');
    });
  });

  describe('GET /api/dealerships/:id', () => {
    test('should return a dealership by ID', async () => {
      const dealership = await Dealership.create({
        name: 'Downtown Motors',
        location: '123 Main St, New York, NY',
        phone: '555-0123',
        email: 'downtown@example.com',
      });

      const response = await request(app).get(`/api/dealerships/${dealership._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(dealership._id.toString());
      expect(response.body.data.name).toBe('Downtown Motors');
      expect(response.body.data.location).toBe('123 Main St, New York, NY');
    });

    test('should return 404 for non-existent dealership', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/dealerships/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dealership not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/dealerships/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should verify dealership data in single response', async () => {
      const dealership = await Dealership.create({
        name: 'Downtown Motors',
        location: '123 Main St, New York, NY',
        phone: '555-0123',
        email: 'downtown@example.com',
      });

      const response = await request(app).get(`/api/dealerships/${dealership._id}`);

      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('location');
      expect(response.body.data).toHaveProperty('phone');
      expect(response.body.data).toHaveProperty('email');
    });
  });
});
