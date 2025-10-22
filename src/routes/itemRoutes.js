const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
const { itemValidators } = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

router.get('/', itemValidators.getAll, validateRequest, getAllItems);
router.get('/:id', itemValidators.getById, validateRequest, getItemById);
router.post('/', itemValidators.create, validateRequest, createItem);
router.put('/:id', itemValidators.update, validateRequest, updateItem);
router.delete('/:id', itemValidators.delete, validateRequest, deleteItem);

module.exports = router;
