import { Request, Response } from 'express';
import User from '../models/User';
import Tenant from '../models/Tenant';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const TEST_USERS = [
  { email: 'admin@acme.test', password: 'password', role: 'Admin', tenantSlug: 'acme' },
  { email: 'user@acme.test', password: 'password', role: 'Member', tenantSlug: 'acme' },
  { email: 'admin@globex.test', password: 'password', role: 'Admin', tenantSlug: 'globex' },
  { email: 'user@globex.test', password: 'password', role: 'Member', tenantSlug: 'globex' },
];

async function ensureTestUsers() {
  for (const u of TEST_USERS) {
    let tenant = await Tenant.findOne({ slug: u.tenantSlug });
    if (!tenant) {
      tenant = await Tenant.create({ name: u.tenantSlug.charAt(0).toUpperCase() + u.tenantSlug.slice(1), slug: u.tenantSlug });
    }
    let user = await User.findOne({ email: u.email });
    if (!user) {
      await User.create({
        email: u.email,
        password: await bcrypt.hash(u.password, 10),
        role: u.role,
        tenantId: tenant._id,
      });
    }
  }
}

export const login = async (req: Request, res: Response) => {
  await ensureTestUsers();
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const tenant = await Tenant.findById(user.tenantId);
  if (!tenant) return res.status(401).json({ message: 'Tenant not found' });
  const payload = {
    userId: user._id,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token, user: payload, tenant: { name: tenant.name, slug: tenant.slug, plan: tenant.plan } });
};
