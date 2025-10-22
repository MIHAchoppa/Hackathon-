const express = require('express');
const router = express.Router();
const { healthCheck, readinessCheck } = require('../controllers/healthController');

router.get('/health', healthCheck);
router.get('/ready', readinessCheck);

module.exports = router;
