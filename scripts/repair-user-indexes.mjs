#!/usr/bin/env node

import 'dotenv/config';
import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || 'CSE341ProjectDB';

if (!mongoURI) {
  console.error('MONGO_URI is required');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName,
    });
    console.log(`Connected to MongoDB database: ${dbName}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const indexes = await usersCollection.indexes();
    console.log('Current users indexes:');
    indexes.forEach((idx) => console.log(JSON.stringify(idx, null, 2)));

    const emailIndex = indexes.find((idx) => idx.key && idx.key.email === 1);
    if (emailIndex) {
      console.log('Found email index:', emailIndex.name);
      if (!emailIndex.unique || !emailIndex.collation || emailIndex.collation.strength !== 2) {
        console.log('Removing invalid email index to recreate it correctly.');
        await usersCollection.dropIndex(emailIndex.name);
      } else {
        console.log('Email index is valid and case-insensitive. No action needed.');
      }
    } else {
      console.log('No email index found. Creating correct unique index.');
    }

    const expectedName = 'email_1';
    await usersCollection.createIndex(
      { email: 1 },
      { name: expectedName, unique: true, collation: { locale: 'en', strength: 2 } }
    );
    console.log('Created unique case-insensitive email index:', expectedName);

    const duplicates = await usersCollection.aggregate([
      { $group: { _id: { $toLower: '$email' }, ids: { $push: '$_id' }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]).toArray();

    if (duplicates.length > 0) {
      console.warn('Duplicate emails detected (lowercased):');
      duplicates.forEach((dup) => {
        console.warn(`- email: ${dup._id}, count: ${dup.count}, ids: ${dup.ids.join(', ')}`);
      });
      console.warn('Please remove or merge duplicate documents before relying on the unique index.');
    } else {
      console.log('No duplicate email documents found.');
    }
  } catch (error) {
    console.error('Repair failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
