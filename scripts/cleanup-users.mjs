#!/usr/bin/env node

/**
 * Database Cleanup Utility
 * 
 * Usage:
 *   node scripts/cleanup-users.mjs                    # Show all users
 *   node scripts/cleanup-users.mjs --email user@test.com # Remove specific email
 *   node scripts/cleanup-users.mjs --all              # Remove ALL users (DANGEROUS)
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const args = process.argv.slice(2);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for cleanup');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const showAllUsers = async () => {
  const users = await User.find().select('-password');
  console.log(`\n📋 Total users in database: ${users.length}\n`);
  users.forEach((user) => {
    console.log(`  - ${user.email} (${user.firstName} ${user.lastName}, ${user._id})`);
  });
};

const removeByEmail = async (email) => {
  const user = await User.findOneAndDelete({ email });
  if (user) {
    console.log(`✅ Removed user: ${email} (${user._id})`);
  } else {
    console.log(`❌ No user found with email: ${email}`);
  }
};

const removeAllUsers = async () => {
  const confirmation = process.argv.includes('--force');
  if (!confirmation) {
    console.warn('⚠️  --all flag detected but no --force confirmation. Use: node scripts/cleanup-users.mjs --all --force');
    return;
  }

  const result = await User.deleteMany({});
  console.log(`🗑️  Removed ${result.deletedCount} users from database`);
};

const main = async () => {
  await connectDB();

  try {
    if (args.includes('--all')) {
      await removeAllUsers();
    } else if (args.includes('--email')) {
      const emailIndex = args.indexOf('--email');
      const email = args[emailIndex + 1];
      if (!email) {
        console.error('❌ Email not provided after --email flag');
        process.exit(1);
      }
      await removeByEmail(email);
    } else {
      await showAllUsers();
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Cleanup complete\n');
    process.exit(0);
  }
};

main();
