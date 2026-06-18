import 'dotenv/config';
import mongoose from 'mongoose';
import request from 'supertest';
import app from './server.js';

// This script runs against the MONGO_URI and enforces the project DB name unless overridden.
const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not set. Set MONGO_URI to run this script.');
    process.exit(1);
  }

  const dbName = process.env.MONGO_DB_NAME || 'CSE341ProjectDB';
  await mongoose.connect(mongoUri, { dbName });

  try {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'Password1!', role: 'buyer' });
    console.log('REGISTER status', registerRes.status);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john.doe@example.com', password: 'Password1!' });
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
      .send({ firstName: 'Jane', lastName: 'Roe', email: 'jane.roe@example.com', password: 'Password1!', role: 'seller' });
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
  }
};

run();
