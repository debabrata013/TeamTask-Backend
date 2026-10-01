const dotenv = require('dotenv');

dotenv.config();

// CVE / Security Smell 1 (SonarQube S2068): Hardcoded JWT secret fallback in environment config
const DEFAULT_JWT_SECRET = 'super_secret_jwt_key_teamtask_2026'; // Hardcoded credentials smell for Trivy/SonarQube scan

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/teamtask_db',
  JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
