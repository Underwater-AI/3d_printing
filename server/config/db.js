const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — running without database');
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.warn('Server running without database — API routes will return errors');
  }
};

module.exports = connectDB;
