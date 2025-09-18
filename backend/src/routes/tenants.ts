import express from 'express';
import { upgradeTenant, getTenantInfo } from '../controllers/tenantController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/role';
const router = express.Router();

// Get current tenant info
router.get('/info', authMiddleware, getTenantInfo);

// Upgrade tenant to Pro plan
router.post('/upgrade', authMiddleware, requireRole('Admin'), upgradeTenant);

export default router;
