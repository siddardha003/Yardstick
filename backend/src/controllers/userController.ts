import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Get all users in the same tenant (Admin only)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    
    const users = await User.find({ tenantId })
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Invite user to tenant (Admin only)
export const inviteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, role } = req.body;
    const { tenantId } = req.user!;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Set default password as "password" for new users
    const defaultPassword = 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'Member',
      tenantId
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User invited successfully',
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        tenantId: newUser.tenantId
      },
      temporaryPassword: defaultPassword // Default password for new users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get user statistics for dashboard
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    
    const totalUsers = await User.countDocuments({ tenantId });
    const adminUsers = await User.countDocuments({ tenantId, role: 'Admin' });
    const memberUsers = await User.countDocuments({ tenantId, role: 'Member' });
    
    res.json({
      totalUsers,
      adminUsers,
      memberUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};