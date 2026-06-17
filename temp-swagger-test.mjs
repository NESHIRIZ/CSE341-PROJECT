import 'dotenv/config';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from './server.js';

const run = async () => {
  const mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'swagger-test' } });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { dbName: 'swagger-test' });

  try {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123', role: 'buyer' });
    console.log('REGISTER status', registerRes.status);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john.doe@example.com', password: 'password123' });
    console.log('LOGIN status', loginRes.status);
    const token = loginRes.body.token;

    const dealershipRes = await request(app)
      .post('/api/dealerships')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Dealer', location: '123 Market St', phone: '123-456-7890', email: 'dealer@test.com' });
    console.log('DEALERSHIP status', dealershipRes.status);

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ make: 'Toyota', model: 'Corolla', year: 2020, price: 18000, mileage: 20000, dealerId: dealershipRes.body.data._id });
    console.log('VEHICLE status', vehicleRes.status);

    const reviewRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: registerRes.body.data._id, vehicleId: vehicleRes.body.data._id, rating: 5, comment: 'Excellent car' });
    console.log('REVIEW status', reviewRes.status);

    const createUserRes = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Jane', lastName: 'Roe', email: 'jane.roe@example.com', password: 'password123', role: 'seller' });
    console.log('CREATE USER status', createUserRes.status);

    console.log('REGISTER body', registerRes.body);
    console.log('DEALERSHIP body', dealershipRes.body);
    console.log('VEHICLE body', vehicleRes.body);
    console.log('REVIEW body', reviewRes.body);
    console.log('CREATE USER body', createUserRes.body);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
};

run();
