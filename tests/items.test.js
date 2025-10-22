const request = require('supertest');
const app = require('../src/app');
const config = require('../src/config');

const apiPrefix = config.apiPrefix;

describe('Items API Endpoints', () => {
  describe('GET /items', () => {
    it('should return 200 and list of items', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/items`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });
    
    it('should support pagination', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/items?page=1&limit=5`)
        .expect(200);
      
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.itemsPerPage).toBe(5);
    });
    
    it('should support search', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/items?search=sample`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
    });
  });
  
  describe('GET /items/:id', () => {
    it('should return 200 and item details for valid id', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/items/1`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name');
    });
    
    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/items/9999`)
        .expect(404);
      
      expect(response.body.status).toBe('fail');
    });
    
    it('should return 400 for invalid id', async () => {
      const response = await request(app)
        .get(`${apiPrefix}/items/invalid`)
        .expect(400);
      
      expect(response.body.status).toBe('fail');
    });
  });
  
  describe('POST /items', () => {
    it('should create a new item with valid data', async () => {
      const newItem = {
        name: 'Test Item',
        description: 'This is a test item description'
      };
      
      const response = await request(app)
        .post(`${apiPrefix}/items`)
        .send(newItem)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newItem.name);
      expect(response.body.data.description).toBe(newItem.description);
    });
    
    it('should return 400 for missing name', async () => {
      const invalidItem = {
        description: 'This is a test item description'
      };
      
      const response = await request(app)
        .post(`${apiPrefix}/items`)
        .send(invalidItem)
        .expect(400);
      
      expect(response.body.status).toBe('fail');
    });
    
    it('should return 400 for short description', async () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'Short'
      };
      
      const response = await request(app)
        .post(`${apiPrefix}/items`)
        .send(invalidItem)
        .expect(400);
      
      expect(response.body.status).toBe('fail');
    });
  });
  
  describe('PUT /items/:id', () => {
    it('should update an existing item', async () => {
      const updateData = {
        name: 'Updated Item Name',
        description: 'This is an updated description'
      };
      
      const response = await request(app)
        .put(`${apiPrefix}/items/1`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(updateData.name);
    });
    
    it('should return 404 for non-existent item', async () => {
      const updateData = {
        name: 'Updated Item Name',
        description: 'This is an updated description'
      };
      
      const response = await request(app)
        .put(`${apiPrefix}/items/9999`)
        .send(updateData)
        .expect(404);
      
      expect(response.body.status).toBe('fail');
    });
  });
  
  describe('DELETE /items/:id', () => {
    it('should delete an existing item', async () => {
      const response = await request(app)
        .delete(`${apiPrefix}/items/2`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
    });
    
    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete(`${apiPrefix}/items/9999`)
        .expect(404);
      
      expect(response.body.status).toBe('fail');
    });
  });
});
