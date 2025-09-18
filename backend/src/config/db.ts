// MongoDB connection
import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yardstick';
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};
