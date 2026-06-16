import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  // Connect to test MongoDB database
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  // Disconnect from MongoDB after all tests
  await mongoose.connection.close();
});
