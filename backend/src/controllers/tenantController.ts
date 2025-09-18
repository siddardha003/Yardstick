import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Tenant from '../models/Tenant';

export const upgradeTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    tenant.plan = 'pro';
    await tenant.save();
    res.json({ 
      message: 'Tenant upgraded to Pro successfully!', 
      plan: tenant.plan,
      tenant: {
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTenantInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
