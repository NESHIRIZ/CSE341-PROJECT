import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @async
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    mongoose.set('strictQuery', false);
    mongoose.set('autoIndex', true);

    // Warn if multiple mongoose connections are present
    if (mongoose.connections && mongoose.connections.length > 1) {
      console.warn('Multiple mongoose connections detected:', mongoose.connections.length);
    }

    const dbName = process.env.MONGO_DB_NAME || 'CSE341ProjectDB';
    const uriDbName = (() => {
      try {
        const url = new URL(mongoURI);
        return url.pathname && url.pathname !== '/' ? decodeURIComponent(url.pathname.slice(1)) : null;
      } catch {
        return null;
      }
    })();

    console.log(`MONGO_URI database path: ${uriDbName || 'none'}`);
    console.log(`Enforcing database name: ${dbName}`);

    if (uriDbName && uriDbName.toLowerCase() === 'contactsdb') {
      throw new Error('MONGO_URI must not point to contactsDB. Use CSE341ProjectDB only.');
    }

    if (uriDbName && uriDbName !== dbName) {
      console.warn(`MONGO_URI contains database '${uriDbName}', but configured dbName is '${dbName}'. Using dbName option to enforce CSE341ProjectDB.`);
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      dbName,
    });

    const connectedName = mongoose.connection && mongoose.connection.name ? mongoose.connection.name : 'unknown';
    console.log(`MongoDB connected successfully (database: ${connectedName})`);
    console.log(`Mongoose ready state: ${mongoose.connection.readyState}`);
    const db = mongoose.connection.db;

    try {
      const usersCollection = db.collection('users');
      const indexes = await usersCollection.indexes();
      console.log('Current users indexes:', indexes);

      const emailIndex = indexes.find((idx) => idx.key && idx.key.email === 1);
      const needsRebuild = !emailIndex || !emailIndex.unique || !emailIndex.collation || emailIndex.collation.strength !== 2;

      const duplicates = await usersCollection.aggregate([
        { $group: { _id: { $toLower: '$email' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { count: { $gt: 1 } } },
      ]).toArray();

      if (duplicates.length > 0) {
        console.warn('Duplicate users detected by normalized email:', duplicates);
      }

      if (needsRebuild && duplicates.length === 0) {
        if (emailIndex) {
          console.warn('Removing invalid users.email index:', emailIndex.name);
          await usersCollection.dropIndex(emailIndex.name);
        }
        await usersCollection.createIndex({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
        console.log('Created/ensured unique case-insensitive users.email index');
      } else if (!needsRebuild) {
        console.log('Users.email index is valid and case-insensitive');
      }
    } catch (innerError) {
      console.warn('Index check or creation failed:', innerError.message);
    }

    // Optional DB audit: indexes and duplicate detection on users collection
    if (process.env.DB_AUDIT_ON_STARTUP === 'true') {
      try {
        const admin = mongoose.connection.db;
        const collections = await admin.listCollections().toArray();
        const hasUsers = collections.some((c) => c.name === 'users');
        if (hasUsers) {
          const usersCollection = admin.collection('users');
          const indexInfo = await usersCollection.indexInformation({ full: true }).catch(() => null);
          console.log('Users collection index information:', indexInfo || 'unavailable');

          // Find duplicate emails grouped by lowercased email (just in case)
          const duplicates = await usersCollection.aggregate([
            { $group: { _id: { $toLower: '$email' }, count: { $sum: 1 }, docs: { $push: '$_id' } } },
            { $match: { count: { $gt: 1 } } },
          ]).toArray();

          if (duplicates && duplicates.length > 0) {
            console.warn('Duplicate users detected (by email):', duplicates);
          } else {
            console.log('No duplicate users detected.');
          }
        } else {
          console.log('Users collection not present yet - skipping index/duplicate checks.');
        }
      } catch (auditErr) {
        console.warn('DB audit on startup failed:', auditErr.message);
      }
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
