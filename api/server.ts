import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { 
  corsOptions, 
  generalRateLimit, 
  authRateLimit, 
  helmetConfig, 
  sanitizeInput, 
  requestLogger 
} from './middleware/security';

// Import routes
import apiRoutes from './routes/index';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmetConfig);

// Request logging
app.use(requestLogger);

// CORS configuration
app.use(cors(corsOptions));

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use('/api/', generalRateLimit);
app.use('/api/auth/', authRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Routes
app.use('/api', apiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);



// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;