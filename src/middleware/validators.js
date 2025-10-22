const { body, param, query } = require('express-validator');

const itemValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
  ],
  
  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters')
  ],
  
  getById: [
    param('id')
      .isInt({ min: 1 }).withMessage('ID must be a positive integer')
  ],
  
  delete: [
    param('id')
      .isInt({ min: 1 }).withMessage('ID must be a positive integer')
  ],
  
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Search query too long')
  ]
};

module.exports = {
  itemValidators
};
