import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Dealership from '../models/Dealership.js';

describe('Reviews GET Routes', () => {
  let userId, vehicleId, dealershipId;

  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Create test user
    const user = await User.create({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      password: 'password123',
      role: 'buyer',
    });
    userId = user._id;

    // Create test dealership
    const dealership = await Dealership.create({
      name: 'Test Dealership',
      location: '123 Main St',
      phone: '555-0123',
      email: 'dealer@example.com',
    });
    dealershipId = dealership._id;

    // Create test vehicle
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
    // Clean up and disconnect
    await Review.deleteMany({});
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Dealership.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clean reviews before each test
    await Review.deleteMany({});
  });

  describe('GET /api/reviews', () => {
    test('should return all reviews with success true', async () => {
      // Create test reviews
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

    test('should verify review data accuracy', async () => {
      const review = await Review.create({
        userId,
        vehicleId,
        rating: 4,
        comment: 'Great car!',
      });

      const response = await request(app).get(`/api/reviews/${review._id}`);

      expect(response.body.data.rating).toBe(4);
      expect(response.body.data.comment).toBe('Great car!');
    });
  });
});
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return reviews with populated references', async () => {
      const response = await request(app).get('/api/reviews');
      if (response.body.data.length > 0) {
        const review = response.body.data[0];
        expect(review.productId).toBeDefined();
        expect(review.userId).toBeDefined();
        expect(review.rating).toBeDefined();
      }
    });

    test('should return valid ratings', async () => {
      const response = await request(app).get('/api/reviews');
      if (response.body.data.length > 0) {
        const review = response.body.data[0];
        expect(review.rating).toBeGreaterThanOrEqual(1);
        expect(review.rating).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('GET /api/reviews/:id', () => {
    let reviewId;

    beforeAll(async () => {
      const review = await Review.findOne({ rating: 5 });
      reviewId = review._id.toString();
    });

    test('should get review by valid ID', async () => {
      const response = await request(app).get(`/api/reviews/${reviewId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should return review data with comment', async () => {
      const response = await request(app).get(`/api/reviews/${reviewId}`);
      expect(response.body.data.rating).toBe(5);
      expect(response.body.data.comment).toBe('Excellent product!');
    });

    test('should return 404 for non-existent review', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app).get(`/api/reviews/${fakeId}`);
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/reviews/invalidid');
      expect(response.status).toBe(400);
    });
  });
});
