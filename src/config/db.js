const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async (uriOverride) => {
  try {
    const mongoUri = uriOverride || env.MONGODB_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
