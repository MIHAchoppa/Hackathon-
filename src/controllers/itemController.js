const ApiResponse = require('../utils/apiResponse');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// In-memory store for demonstration (replace with database in production)
let items = [
  { id: 1, name: 'Sample Item 1', description: 'This is a sample item', createdAt: new Date() },
  { id: 2, name: 'Sample Item 2', description: 'Another sample item', createdAt: new Date() }
];
let nextId = 3;

const getAllItems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredItems = items;
  
  // Simple search functionality
  if (search) {
    filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  
  const response = {
    items: paginatedItems,
    pagination: {
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit),
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / limit)
    }
  };
  
  ApiResponse.success(res, response, 'Items retrieved successfully');
});

const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = items.find(i => i.id === parseInt(id));
  
  if (!item) {
    throw new AppError('Item not found', 404);
  }
  
  ApiResponse.success(res, item, 'Item retrieved successfully');
});

const createItem = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  const newItem = {
    id: nextId++,
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  items.push(newItem);
  
  ApiResponse.created(res, newItem, 'Item created successfully');
});

const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const itemIndex = items.findIndex(i => i.id === parseInt(id));
  
  if (itemIndex === -1) {
    throw new AppError('Item not found', 404);
  }
  
  items[itemIndex] = {
    ...items[itemIndex],
    name: name || items[itemIndex].name,
    description: description || items[itemIndex].description,
    updatedAt: new Date()
  };
  
  ApiResponse.success(res, items[itemIndex], 'Item updated successfully');
});

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(i => i.id === parseInt(id));
  
  if (itemIndex === -1) {
    throw new AppError('Item not found', 404);
  }
  
  items.splice(itemIndex, 1);
  
  ApiResponse.success(res, null, 'Item deleted successfully');
});

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
