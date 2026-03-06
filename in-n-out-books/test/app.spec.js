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

describe('Chapter 4: API Tests', () => {
  it('should return a 201-status code when adding a new book', async () => {
    const newBook = { title: 'Test Book', author: 'Test Author' };
    const res = await request(app)
      .post('/api/books')
      .send(newBook)
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
  });

  it('should return a 400-status code when adding a new book with missing title', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ author: 'Test Author' })
      .set('Accept', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return a 204-status code when deleting a book', async () => {
    const createRes = await request(app)
      .post('/api/books')
      .send({ title: 'Book to Delete', author: 'Author' })
      .set('Accept', 'application/json');
    const id = createRes.body.id;
    const res = await request(app).delete(`/api/books/${id}`);
    expect(res.status).toBe(204);
  });
});

describe('Chapter 5: API Tests', () => {
  it('should update a book and return a 204-status code', async () => {
    const res = await request(app)
      .put('/api/books/1')
      .send({ title: 'Updated Title', author: 'Updated Author' })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(204);
  });

  it('should return a 400-status code when using a non-numeric id', async () => {
    const res = await request(app)
      .put('/api/books/foo')
      .send({ title: 'Title', author: 'Author' })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual('Input must be a number');
  });

  it('should return a 400-status code when updating a book with a missing title', async () => {
    const res = await request(app)
      .put('/api/books/1')
      .send({ author: 'Author Only' })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual('Bad Request');
  });
});

describe('Chapter 6: API Tests', () => {
  it('should log a user in and return a 200-status with \'Authentication successful\' message', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'harry@hogwarts.edu', password: 'potter' })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Authentication successful');
  });

  it('should return a 401-status code with \'Unauthorized\' message when logging in with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'harry@hogwarts.edu', password: 'wrongpassword' })
      .set('Accept', 'application/json');
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  it('should return a 400-status code with \'Bad Request\' when missing email or password', async () => {
    const resNoEmail = await request(app)
      .post('/api/login')
      .send({ password: 'potter' })
      .set('Accept', 'application/json');
    expect(resNoEmail.status).toEqual(400);
    expect(resNoEmail.body.message).toEqual('Bad Request');

    const resNoPassword = await request(app)
      .post('/api/login')
      .send({ email: 'harry@hogwarts.edu' })
      .set('Accept', 'application/json');
    expect(resNoPassword.status).toEqual(400);
    expect(resNoPassword.body.message).toEqual('Bad Request');
  });
});

describe('Chapter 7: API Tests', () => {
  it('should return a 200 status with \'Security questions successfully answered\' message', async () => {
    const answers = [
      { answer: 'Hedwig' },
      { answer: 'Quidditch Through the Ages' },
      { answer: 'Evans' },
    ];
    const res = await request(app)
      .post('/api/users/harry@hogwarts.edu/verify-security-question')
      .send(answers)
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Security questions successfully answered');
  });

  it('should return a 400 status code with \'Bad Request\' message when the request body fails ajv validation', async () => {
    const invalidBody = [{ answer: 'test' }, { wrongProperty: 'value' }];
    const res = await request(app)
      .post('/api/users/harry@hogwarts.edu/verify-security-question')
      .send(invalidBody)
      .set('Accept', 'application/json');
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual('Bad Request');
  });

  it('should return a 401 status code with \'Unauthorized\' message when the security questions are incorrect', async () => {
    const wrongAnswers = [
      { answer: 'WrongAnswer1' },
      { answer: 'WrongAnswer2' },
      { answer: 'WrongAnswer3' },
    ];
    const res = await request(app)
      .post('/api/users/harry@hogwarts.edu/verify-security-question')
      .send(wrongAnswers)
      .set('Accept', 'application/json');
    expect(res.status).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized');
  });
});
