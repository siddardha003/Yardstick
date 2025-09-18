import express from 'express';
import { upgradeTenant, getTenantInfo } from '../controllers/tenantController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/role';
const router = express.Router();

router.get('/info', authMiddleware, getTenantInfo);
router.post('/upgrade', authMiddleware, requireRole('Admin'), upgradeTenant);

export default router;
