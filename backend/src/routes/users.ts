import express from 'express';
import { getUsers, inviteUser, getUserStats } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get users statistics (Admin only)
router.get('/stats', requireRole('Admin'), getUserStats);

// Get all users in tenant (Admin only)
router.get('/', requireRole('Admin'), getUsers);

// Invite user to tenant (Admin only)
router.post('/invite', requireRole('Admin'), inviteUser);

export default router;