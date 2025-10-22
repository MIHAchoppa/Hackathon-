# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Health Check Endpoints

### GET /health
Get system health status

**Response:**
```json
{
  "status": "success",
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2025-10-22T21:37:24.651Z",
    "uptime": 123.456,
    "environment": "development",
    "memory": {
      "used": 45.67,
      "total": 100.00,
      "unit": "MB"
    }
  }
}
```

### GET /ready
Check if system is ready to accept requests

**Response:**
```json
{
  "status": "success",
  "message": "System is ready",
  "data": {
    "ready": true
  }
}
```

## Items Endpoints

### GET /api/v1/items
Get all items with pagination and search

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search query string

**Example Request:**
```
GET /api/v1/items?page=1&limit=10&search=sample
```

**Response:**
```json
{
  "status": "success",
  "message": "Items retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Sample Item 1",
        "description": "This is a sample item",
        "createdAt": "2025-10-22T21:37:24.651Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "itemsPerPage": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

### GET /api/v1/items/:id
Get a specific item by ID

**Parameters:**
- `id` (required): Item ID (positive integer)

**Example Request:**
```
GET /api/v1/items/1
```

**Response:**
```json
{
  "status": "success",
  "message": "Item retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sample Item 1",
    "description": "This is a sample item",
    "createdAt": "2025-10-22T21:37:24.651Z"
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Item not found"
}
```

### POST /api/v1/items
Create a new item

**Request Body:**
```json
{
  "name": "New Item",
  "description": "This is a new item description"
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `description`: Required, 10-500 characters

**Response (201):**
```json
{
  "status": "success",
  "message": "Item created successfully",
  "data": {
    "id": 3,
    "name": "New Item",
    "description": "This is a new item description",
    "createdAt": "2025-10-22T21:37:24.651Z",
    "updatedAt": "2025-10-22T21:37:24.651Z"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "[{\"field\":\"name\",\"message\":\"Name is required\"}]"
}
```

### PUT /api/v1/items/:id
Update an existing item

**Parameters:**
- `id` (required): Item ID (positive integer)

**Request Body:**
```json
{
  "name": "Updated Item Name",
  "description": "Updated description"
}
```

**Validation Rules:**
- `name`: Optional, 3-100 characters
- `description`: Optional, 10-500 characters

**Response:**
```json
{
  "status": "success",
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Item Name",
    "description": "Updated description",
    "createdAt": "2025-10-22T21:37:24.651Z",
    "updatedAt": "2025-10-22T21:37:30.651Z"
  }
}
```

### DELETE /api/v1/items/:id
Delete an item

**Parameters:**
- `id` (required): Item ID (positive integer)

**Response:**
```json
{
  "status": "success",
  "message": "Item deleted successfully",
  "data": null
}
```

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

### Common Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- Headers included:
  - `RateLimit-Limit`: Maximum requests allowed
  - `RateLimit-Remaining`: Remaining requests
  - `RateLimit-Reset`: Time when limit resets

## Security Features

- Helmet.js for security headers
- CORS enabled
- Rate limiting
- Input validation
- Error handling
- Request logging
