import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(120000);

let mongoServer;
let connectionString;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'vehicle-marketplace-test',
    },
    binary: {
      version: '6.0.8',
    },
  });

  connectionString = mongoServer.getUri();
  process.env.MONGO_URI_TEST = connectionString;
  process.env.MONGO_URI = connectionString;

  mongoose.set('strictQuery', false);
  await mongoose.connect(connectionString);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
