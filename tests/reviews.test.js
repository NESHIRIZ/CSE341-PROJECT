import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Dealership from '../models/Dealership.js';

describe('Reviews GET Routes', () => {
  let userId;
  let vehicleId;
  let dealershipId;

  beforeAll(async () => {
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Dealership.deleteMany({});
    await Review.deleteMany({});

    const user = await User.create({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      password: 'password123',
      role: 'buyer',
    });
    userId = user._id;

    const dealership = await Dealership.create({
      name: 'Test Dealership',
      location: '123 Main St, Test City',
      phone: '555-0123',
      email: 'dealer@example.com',
    });
    dealershipId = dealership._id;

    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 25999.99,
      mileage: 15000,
      dealerId: dealershipId,
    });
    vehicleId = vehicle._id;
  });

  afterAll(async () => {
    await Review.deleteMany({});
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Dealership.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Review.deleteMany({});
  });

  describe('GET /api/reviews', () => {
    test('should return all reviews with success true', async () => {
      await Review.create({
        userId,
        vehicleId,
        rating: 5,
        comment: 'Excellent vehicle!',
      });

      await Review.create({
        userId,
        vehicleId,
        rating: 4,
        comment: 'Great car, highly recommend.',
      });

      const response = await request(app).get('/api/reviews');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    test('should return empty array when no reviews exist', async () => {
      const response = await request(app).get('/api/reviews');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('should populate user and vehicle information', async () => {
      await Review.create({
        userId,
        vehicleId,
        rating: 5,
        comment: 'Excellent vehicle!',
      });

      const response = await request(app).get('/api/reviews');

      expect(response.status).toBe(200);
      expect(response.body.data[0].userId).toHaveProperty('firstName');
      expect(response.body.data[0].userId).toHaveProperty('email');
      expect(response.body.data[0].vehicleId).toHaveProperty('make');
      expect(response.body.data[0].vehicleId).toHaveProperty('model');
    });

    test('should include review properties in response', async () => {
      await Review.create({
        userId,
        vehicleId,
        rating: 5,
        comment: 'Excellent vehicle!',
      });

      const response = await request(app).get('/api/reviews');

      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('userId');
      expect(response.body.data[0]).toHaveProperty('vehicleId');
      expect(response.body.data[0]).toHaveProperty('rating');
      expect(response.body.data[0]).toHaveProperty('comment');
    });
  });

  describe('GET /api/reviews/:id', () => {
    test('should return a review by ID', async () => {
      const review = await Review.create({
        userId,
        vehicleId,
        rating: 5,
        comment: 'Excellent vehicle!',
      });

      const response = await request(app).get(`/api/reviews/${review._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(review._id.toString());
      expect(response.body.data.rating).toBe(5);
      expect(response.body.data.comment).toBe('Excellent vehicle!');
    });

    test('should populate user and vehicle on single review', async () => {
      const review = await Review.create({
        userId,
        vehicleId,
        rating: 5,
        comment: 'Excellent vehicle!',
      });

      const response = await request(app).get(`/api/reviews/${review._id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.userId).toHaveProperty('firstName');
      expect(response.body.data.userId.firstName).toBe('Bob');
      expect(response.body.data.vehicleId).toHaveProperty('make');
      expect(response.body.data.vehicleId.make).toBe('Toyota');
    });

    test('should return 404 for non-existent review', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/reviews/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Review not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/reviews/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
