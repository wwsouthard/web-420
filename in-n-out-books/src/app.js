/**
 * In-N-Out-Books
 * app.js
 *
 * Will Southard
 * January 30, 2026
 * app.js
 * Main application file for the In-N-Out-Books API. Sets up the Express server,
 * routes, and error-handling middleware for the book collection platform.
 */

const express = require('express');
const createError = require('http-errors');
const books = require('../database/books');
const app = express();

app.use(express.json());

/**
 * GET /
 * Landing page for the In-N-Out-Books application.
 */
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>In-N-Out-Books</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600;7..72,700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #e8e8e8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      line-height: 1.6;
    }
    .container {
      max-width: 560px;
      text-align: center;
    }
    h1 {
      font-family: 'Literata', serif;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(90deg, #e94560, #f39c6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .tagline {
      font-size: 1.1rem;
      color: #a0a0b0;
      margin-bottom: 2rem;
      font-weight: 500;
    }
    p {
      color: #c0c0d0;
      margin-bottom: 1rem;
    }
    .badge {
      display: inline-block;
      background: rgba(233, 69, 96, 0.2);
      color: #e94560;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-top: 1.5rem;
      border: 1px solid rgba(233, 69, 96, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>In-N-Out-Books</h1>
    <p class="tagline">Manage your book collection, one chapter at a time.</p>
    <p>Whether you're an avid reader keeping track of what you've read or a book club organizer managing a shared collection, In-N-Out-Books is your platform.</p>
    <span class="badge">API-driven • Build per chapter</span>
  </div>
</body>
</html>
  `);
});

/**
 * GET /api/books
 * Returns an array of books from the mock database.
 */
app.get('/api/books', async (req, res, next) => {
  try {
    const bookList = await books.find();
    res.json(bookList);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/books/:id
 * Returns a single book with the matching id from the mock database.
 */
app.get('/api/books/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      next(createError(400, 'Id must be a number'));
      return;
    }
    const book = await books.findOne({ id });
    res.json(book);
  } catch (err) {
    if (err.message === 'No matching item found') {
      next(createError(404, 'Book not found'));
      return;
    }
    next(err);
  }
});

/**
 * POST /api/books
 * Adds a new book to the mock database. Returns 201 with the created book.
 * Requires title in the request body; returns 400 if title is missing.
 */
app.post('/api/books', async (req, res, next) => {
  try {
    const { title, author } = req.body || {};
    if (!title || (typeof title === 'string' && title.trim() === '')) {
      throw createError(400, 'Title is required');
    }
    const bookList = await books.find();
    const maxId = bookList.length ? Math.max(...bookList.map((b) => b.id)) : 0;
    const newBook = { id: maxId + 1, title: title.trim(), author: author || '' };
    await books.insertOne(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    if (err.status) {
      next(err);
      return;
    }
    next(err);
  }
});

/**
 * PUT /api/books/:id
 * Updates a book with the matching id in the mock database. Returns 204.
 * Requires title in the request body; returns 400 if title is missing or id is not a number.
 */
app.put('/api/books/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      next(createError(400, 'Input must be a number'));
      return;
    }
    const { title, author } = req.body || {};
    if (!title || (typeof title === 'string' && title.trim() === '')) {
      next(createError(400, 'Bad Request'));
      return;
    }
    await books.updateOne({ id }, { title: title.trim(), author: author ?? '' });
    res.status(204).send();
  } catch (err) {
    if (err.message === 'No matching item found') {
      next(createError(404, 'Book not found'));
      return;
    }
    next(err);
  }
});

/**
 * DELETE /api/books/:id
 * Deletes a book with the matching id from the mock database. Returns 204.
 */
app.delete('/api/books/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      next(createError(400, 'Id must be a number'));
      return;
    }
    await books.deleteOne({ id });
    res.status(204).send();
  } catch (err) {
    if (err.message === 'No matching item found') {
      next(createError(404, 'Book not found'));
      return;
    }
    next(err);
  }
});

/**
 * GET /test-error
 * Temporary route to trigger 500 handler for testing. Remove when not needed.
 */
app.get('/test-error', (req, res, next) => {
  next(new Error('Intentional 500 for testing'));
});

/**
 * 404 catch-all handler.
 * Must be registered after all other routes.
 */
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

/**
 * 500 error handler.
 * Returns JSON with error details; includes stack only in development.
 */
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status);
  res.set('Content-Type', 'application/json');
  const payload = {
    error: err.message || 'Internal Server Error',
    status
  };
  if (app.get('env') === 'development' && err.stack) {
    payload.stack = err.stack;
  }
  res.json(payload);
});

module.exports = app;
