import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(120000);

let mongoServer;
let connectionString;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: process.env.MONGO_DB_NAME || 'CSE341ProjectDB',
    },
    binary: {
      version: '6.0.8',
    },
  });

  connectionString = mongoServer.getUri();
  process.env.MONGO_URI_TEST = connectionString;
  process.env.MONGO_URI = connectionString;
  process.env.MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'CSE341ProjectDB';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

  mongoose.set('strictQuery', false);
  await mongoose.connect(connectionString, {
    dbName: process.env.MONGO_DB_NAME,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
