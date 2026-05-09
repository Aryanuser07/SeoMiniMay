require('dotenv').config();
const express = require('express');
const cors = require('cors');
const generateRouter = require('./routes/generate');
const historyRouter = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all origins for local dev
app.use(express.json());

// Routes
app.use('/api/generate', generateRouter);
app.use('/api/history', historyRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 LocalSEO AI Server running on http://localhost:${PORT}`);
});
