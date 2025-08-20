const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the application
let app;

describe('Book API', () => {
  beforeAll(async () => {
    // Avoid loading the app before setting environment variables
    app = require('../app').default;
    
    // Use a separate test database
    const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/bookstore-test';
    await mongoose.connect(testDbUri);
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('GET /api/books', () => {
    it('should return a list of books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/books?page=1&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body.currentPage).toBe(1);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should support search', async () => {
      // This test may fail if there is no data in the database
      const searchTerm = 'test';
      const res = await request(app).get(`/api/books?search=${searchTerm}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/books/search/advanced', () => {
    it('should support advanced search', async () => {
      const res = await request(app).get('/api/books/search/advanced?minPrice=10&maxPrice=100');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // Note: Tests for creating, updating, and deleting books require authentication
  // and will need more complex setup
});