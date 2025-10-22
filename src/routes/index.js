const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const itemRoutes = require('./itemRoutes');

// Health check routes (no prefix)
router.use('/', healthRoutes);

// API routes
router.use('/items', itemRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Hackathon Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      readiness: 'GET /ready',
      items: {
        getAll: 'GET /api/v1/items',
        getById: 'GET /api/v1/items/:id',
        create: 'POST /api/v1/items',
        update: 'PUT /api/v1/items/:id',
        delete: 'DELETE /api/v1/items/:id'
      }
    }
  });
});

module.exports = router;
