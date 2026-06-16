import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Vehicle from '../models/Vehicle.js';
import Dealership from '../models/Dealership.js';

describe('Vehicles GET Routes', () => {
  let dealershipId;

  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Create a test dealership
    const dealership = await Dealership.create({
      name: 'Test Dealership',
      location: '123 Main St',
      phone: '555-0123',
      email: 'dealer@example.com',
    });
    dealershipId = dealership._id;
  });

  afterAll(async () => {
    // Clean up and disconnect
    await Vehicle.deleteMany({});
    await Dealership.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean database before each test
    await Vehicle.deleteMany({});
  });

  describe('GET /api/vehicles', () => {
    test('should return all vehicles with success true', async () => {
      // Create test vehicles
      await Vehicle.create({
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25999.99,
        mileage: 15000,
        dealerId: dealershipId,
      });

      await Vehicle.create({
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        price: 22999.99,
        mileage: 20000,
        dealerId: dealershipId,
      });

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test('should return empty array when no vehicles exist', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('should populate dealership information', async () => {
      await Vehicle.create({
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25999.99,
        mileage: 15000,
        dealerId: dealershipId,
      });

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.data[0].dealerId).toHaveProperty('_id');
      expect(response.body.data[0].dealerId).toHaveProperty('name');
      expect(response.body.data[0].dealerId.name).toBe('Test Dealership');
    });

    test('should include vehicle properties in response', async () => {
      await Vehicle.create({
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25999.99,
        mileage: 15000,
        dealerId: dealershipId,
      });

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('make');
      expect(response.body.data[0]).toHaveProperty('model');
      expect(response.body.data[0]).toHaveProperty('year');
      expect(response.body.data[0]).toHaveProperty('price');
      expect(response.body.data[0]).toHaveProperty('mileage');
      expect(response.body.data[0]).toHaveProperty('dealerId');
    });
  });

  describe('GET /api/vehicles/:id', () => {
    test('should return a vehicle by ID', async () => {
      const vehicle = await Vehicle.create({
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25999.99,
        mileage: 15000,
        dealerId: dealershipId,
      });

      const response = await request(app).get(`/api/vehicles/${vehicle._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(vehicle._id.toString());
      expect(response.body.data.make).toBe('Toyota');
      expect(response.body.data.model).toBe('Camry');
      expect(response.body.data.year).toBe(2022);
    });

    test('should populate dealership on single vehicle', async () => {
      const vehicle = await Vehicle.create({
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25999.99,
        mileage: 15000,
        dealerId: dealershipId,
      });

      const response = await request(app).get(`/api/vehicles/${vehicle._id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.dealerId).toHaveProperty('name');
      expect(response.body.data.dealerId.name).toBe('Test Dealership');
    });

    test('should return 404 for non-existent vehicle', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/vehicles/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Vehicle not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/vehicles/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
