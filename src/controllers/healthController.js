const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/errorHandler');
const config = require('../config');

const healthCheck = asyncHandler(async (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      unit: 'MB'
    }
  };
  
  ApiResponse.success(res, healthData, 'System is healthy');
});

const readinessCheck = asyncHandler(async (req, res) => {
  // Add checks for database, external services, etc.
  const isReady = true; // Placeholder
  
  if (isReady) {
    ApiResponse.success(res, { ready: true }, 'System is ready');
  } else {
    ApiResponse.error(res, 'System is not ready', 503);
  }
});

module.exports = {
  healthCheck,
  readinessCheck
};
