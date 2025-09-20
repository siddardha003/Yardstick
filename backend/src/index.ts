// Express server setup
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Debug endpoint
app.get('/debug', (req, res) => {
  res.json({
    status: 'ok',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      HAS_MONGODB_URI: !!process.env.MONGODB_URI,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
import authRoutes from './routes/auth';
import tenantRoutes from './routes/tenants';
import noteRoutes from './routes/notes';
import userRoutes from './routes/users';
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/notes', noteRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 4000;

// Start server with better error handling
const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    // Continue without DB for debugging
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB URI exists: ${!!process.env.MONGODB_URI}`);
  });
};

startServer();
