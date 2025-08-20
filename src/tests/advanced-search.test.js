// Advanced Search System Test

const request = require('supertest');
const app = require('../app');

describe('Advanced Search API', () => {
  it('should search books by title', async () => {
    const res = await request(app)
      .get('/api/books/search/advanced')
      .query({ title: 'test' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
  });

  it('should search books by price range', async () => {
    const res = await request(app)
      .get('/api/books/search/advanced')
      .query({ minPrice: 10, maxPrice: 50 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
  });

  it('should search books by published date range', async () => {
    const res = await request(app)
      .get('/api/books/search/advanced')
      .query({ 
        publishedAfter: '2020-01-01', 
        publishedBefore: '2023-12-31' 
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
  });

  it('should search books with exact match', async () => {
    const res = await request(app)
      .get('/api/books/search/advanced')
      .query({ 
        title: 'specific title',
        exactMatch: 'true'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
  });

  it('should combine multiple search criteria', async () => {
    const res = await request(app)
      .get('/api/books/search/advanced')
      .query({ 
        author: 'author name',
        minPrice: 20,
        maxPrice: 100,
        publishedAfter: '2021-01-01'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
  });
});