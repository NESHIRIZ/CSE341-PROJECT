import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/auth/register should create a new user and return token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@test.com',
        password: 'Password1',
        role: 'buyer',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data.email).toBe('alice@test.com');
  });

  test('POST /api/auth/login should return token for valid credentials', async () => {
    await User.create({
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@test.com',
      password: 'Password1',
      role: 'buyer',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@test.com',
        password: 'Password1',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data.email).toBe('alice@test.com');
  });

  test('POST /api/auth/register should not allow duplicate emails', async () => {
    await User.create({
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@test.com',
      password: 'Password1',
      role: 'buyer',
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@test.com',
        password: 'Password1',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Email already in use');
  });

  test('GET /api/auth/me should return current user when authenticated', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@test.com',
        password: 'Password1',
      });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${registerRes.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('alice@test.com');
  });
});
