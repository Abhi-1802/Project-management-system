const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

app.use(cors({
  origin: "https://project-management-system-tau-rose.vercel.app",
  credentials: true
}));
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logging (dev only)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// 404 for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;