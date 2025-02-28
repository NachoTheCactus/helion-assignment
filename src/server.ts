import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from './config/db';

// Import routes
import clientRoutes from './routes/clientRoutes';
import salesRepRoutes from './routes/salesRepRoutes';
import offerRoutes from './routes/offerRoutes';
import contractRoutes from './routes/contractRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors({
  origin: [FRONTEND_URL, 'http://frontend:5173', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/sales-reps', salesRepRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contracts', contractRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await disconnectDatabase();;
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

export default app;