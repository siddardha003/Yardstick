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
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
