/**
 * In-N-Out-Books
 * app.spec.js
 *
 * Will Southard
 * February 8, 2026
 * Unit tests for the In-N-Out-Books API (Chapter 3).
 */

const request = require('supertest');
const app = require('../src/app');

describe('Chapter 3: API Tests', () => {
  describe('GET /api/books', () => {
    it('should return an array of books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('author');
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return a single book', async () => {
      const res = await request(app).get('/api/books/1');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('author');
    });

    it('should return a 400 error if the id is not a number', async () => {
      const res = await request(app).get('/api/books/abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/number/i);
    });
  });
});
