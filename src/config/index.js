require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API configuration
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN ? (process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN.split(',')) : false,
    credentials: true
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};

module.exports = config;
